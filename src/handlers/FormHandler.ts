import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { parse } from "csv-parse";
import * as path from "path";
import Wick from "../wick";
import * as fs from "fs";
import {Collection, Guild, GuildMember, Role} from "discord.js";

type FormSubmission = {
  Timestamp: string,
  "Email Address": string,
  "What is your Discord Username": string,
  "What best describes your Faculty Status?": string
}

type AlreadyCheckedUser = {
  timeStamp: string
  email:string
}

type FacultyMember = {
  name: string,
  ext: string,
  email: string,
  dept: string,
  title: string
}

const spreadsheetId = "";

enum FACULTY_ROLES  {
  Base = "1219282682962378753",
  Aramark = "1219283160357933156",
  Professor = "1219282716953022524",
  'Campus Safety' = "1219283087591084032",
  'Campus Official (President, VP, Admissions, Registrar, Financial Aid, etc.)' = "1219283248543301652"
}

export default class FormHandler {
  Wick;
  formSubmissions: FormSubmission[];
  formWatcher: NodeJS.Timeout | undefined;
  localStaffDir: FacultyMember[] | undefined;

  constructor(Wick: Wick) {
    this.Wick = Wick;
    this.formSubmissions = []
    this.parseLocalDir().then((parsedData) => {
      this.localStaffDir = parsedData;
    });

    this.setupWatcher();
  }

  setupWatcher() {
    // Creates a form watcher that runs every 2.5 minutes.
    this.formWatcher = setInterval(async () => {
      console.log("[2.5min Interval] Checking Form Submissions.");

      await this.pullData()
      this.checkData();
    }, 150000)
  }

  stopWatcher() {
    clearInterval(this.formWatcher);
    this.formWatcher = undefined;
  }

  async pullData(): Promise<void> {
    return new Promise<void>((resolve) => {
      const parser = new PublicGoogleSheetsParser(process.env.GOOGLE_SHEET_ID);

      parser.parse().then(data =>  {
        this.formSubmissions = data;

        resolve();
      });
    });
  }

  checkData() {
    const alreadyCheckedFile = path.join(__dirname, "../../data/alreadyChecked.json");

    if (!fs.existsSync(alreadyCheckedFile))
      fs.writeFileSync(alreadyCheckedFile, JSON.stringify([]));

    const alreadyCheckedData = fs.readFileSync(alreadyCheckedFile);
    const alreadyCheckedJson = JSON.parse(alreadyCheckedData.toString());

    for (let i = 0; i < this.formSubmissions.length; i++) {
      let formSubmission = this.formSubmissions[i];

      const alreadyCheckedUser = alreadyCheckedJson
        .find((user: AlreadyCheckedUser) => user.email == formSubmission["Email Address"])

      if (alreadyCheckedUser && alreadyCheckedUser.timeStamp == formSubmission.Timestamp) {
        return;
      }

      alreadyCheckedJson.splice(i, 1);
      this.checkUser(formSubmission)
      alreadyCheckedJson.push({
        timeStamp: formSubmission.Timestamp,
        email: formSubmission["Email Address"]
      })

      fs.writeFileSync(alreadyCheckedFile, JSON.stringify(alreadyCheckedJson));
    }
  }

  parseLocalDir() {
    return new Promise<FacultyMember[]>((resolve) => {
      let parsedDataArray: FacultyMember[] = [];
      const staffDirPath = path.join(__dirname, "../../data/StaffDir.csv");
      const staffDirData = fs.readFileSync(staffDirPath);

      parse(staffDirData.toString(), {
        columns: ["name", "ext", "email", "dept", "title"],
        bom: true
      }, (err, parsedData: FacultyMember[]) => {
        if (err) {
          console.error(err)
          resolve(parsedDataArray);
        }

        parsedDataArray = parsedData
        resolve(parsedDataArray);
      });
    })
  }

  async checkUser(formSubmission: FormSubmission) {
    if (this.localStaffDir == undefined) return;

    const responseUsername = formSubmission["Email Address"].replace("@hartwick.edu", "");
    const facultyMember = this.localStaffDir.find((localFacultyMember: FacultyMember) => localFacultyMember.email == responseUsername);

    if (!facultyMember) {
      console.log(`[WARNING]: ${formSubmission["Email Address"]} attempted to verify as faculty.`)
      return;
    }
    // @ts-ignore
    const WICKHangoutGuild = await this.Wick.Client.guilds.fetch(process.env.DISCORD_GUILD_ID);

    const WICKMember: GuildMember | undefined = await WICKHangoutGuild.members.fetch(
      {query: formSubmission["What is your Discord Username"].replace("@", ""), limit: 1})
      .then((foundMembers) => foundMembers.at(0));

    if (WICKMember == undefined) {
      console.log(`[WARNING]: Faculty Member ${formSubmission["Email Address"]} verified, but was unable to find them on Discord ${formSubmission["What is your Discord Username"]}!`);
    } else {
      // @ts-ignore
      await WICKMember.roles.add(FACULTY_ROLES["Base"]);

      // @ts-ignore
      await WICKMember.roles.add(FACULTY_ROLES[formSubmission["What best describes your Faculty Status?"]]);
    }
  }
}
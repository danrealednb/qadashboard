import * as dotenv from "dotenv";
dotenv.config();
import { getAutomatedTypes, getTestCaseTypes } from "~/data/testrail.server";
import fs from "fs";

const createSwitchStatement = (
  testTypes: Array<{ testCaseTypeId: string; testCaseType: string }>
) => {
  const tcts = [];
  const header = `export const testTypeMapping = (testType: number) => {\n\tswitch (testType) {`;
  tcts.push(header);
  for (let index = 0; index < testTypes.length; index++) {
    const element = testTypes[index];
    const str = `\t\tcase ${element.testCaseTypeId}:\n\t\t\treturn "${element.testCaseType}";`;
    tcts.push(str);
  }
  const footer = `\t\tdefault:\n\t\t\treturn "N/A"\n\t}\n};`;
  tcts.push(footer);
  //   console.log(tcts.join("\n"));
  return tcts.join("\n");
};

async function main() {
  const testTypes = await getTestCaseTypes();
  // console.log(testTypes);
  const testTypeFunction = createSwitchStatement(testTypes!!);

  const automatedTestTypes = await getAutomatedTypes();
  console.log(automatedTestTypes);
  console.log(
    `Take the statuses that make the test automated and manual and change those ids in ./app/data/testrail.server.ts line 155 and 160`
  );
  console.log(
    `Do a find and replace for anywhere you find testCase.custom_automated_test and replace it with testCase.custom_${process.env.CUSTOM_AUTOMATED_STATUS_NAME}`
  );
  console.log(
    `Do the same find and replace for element.custom_automated_test and replace with element.custom_${process.env.CUSTOM_AUTOMATED_STATUS_NAME}`
  );

  console.log(
    "Change the ids for manual and automated in featurecoverage and stories routes"
  );

  fs.writeFileSync(`./app/utils/testTypes.ts`, testTypeFunction);
  console.log(`${process.cwd()}/app/utils/testTypes.ts has been updated!`);
}

main();

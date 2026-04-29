/// <reference types="node" />
//import {getAvailableOrg} from "../cli/getOrgInfo";
import {salesforceOrgInfo} from "./interface";
export async function getApexClassNames(orgInfo: salesforceOrgInfo){
  //const orgInfo = await getAvailableOrg();
  const query = run();
  const url = `${orgInfo.instanceUrl}/services/data/v60.0/tooling/query?q=${encodeURIComponent(query)}`;
  console.log('called the command executer', url );
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${orgInfo.accessToken.trim()}`,
      "Content-Type": "application/json",
    },
  });
  console.log('apex class response => ', JSON.stringify(response));
  
  // Read body ONLY once
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Tooling API Failed ${response.status}: ${text}`);
  }

  const data = JSON.parse(text);

  return data; // contains records[]
}

export function run(){
    return "Select Id,Name from apexClass limit 5";
}

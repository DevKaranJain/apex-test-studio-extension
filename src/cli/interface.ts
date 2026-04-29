
export interface salesforceOrglist {
     scratchOrgs : OrgEntry[];
    nonScratchOrgs:OrgEntry[];
}
export interface OrgEntry {
    alias: string;
    username: string;
    orgId: string;
    status: string;
    isDefault?: boolean;
}

export interface salesforceOrgInfo{
    accessToken : string; 
    userName : string; 
    instanceUrl : string; 
    orgId : string; 
    alias : string;
}
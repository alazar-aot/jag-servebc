export const sortingList = [
  {sortBy:"created",label:"Modified", sortOrder:" "},
  {sortBy:"priority",label:"Priority", sortOrder:" "},
  {sortBy:"dueDate",label:"Served Date", sortOrder:"asc"},
  {sortBy:"assignee",label:"Edited by", sortOrder:" "},
  {sortBy:"name",label:"name", sortOrder:" "},
  {sortBy:"followUpDate",label:"followUpDate", sortOrder:" "},
  {sortBy:"processVariable",label:"Party", sortOrder:" ", 
    "parameters":{
      "variable" : "partyName",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Criminal Matter", sortOrder:" ", 
    "parameters":{
      "variable" : "isCriminal",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Next Appearance Date", sortOrder:" ", 
    "parameters":{
      "variable" : "nextAppearanceDate",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Responsibility", sortOrder:" ", 
    "parameters":{
      "variable" : "staffGroup",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Court/Tribunal File #", sortOrder:" ", 
    "parameters":{
      "variable" : "courtOrTribunalFileNbr",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Served Date old", sortOrder:" ", 
    "parameters":{
      "variable" : "servedDate",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Next AppearanceDateFormat", sortOrder:" ", 
    "parameters":{
      "variable" : "nextAppearanceDateFormat",
      "type" : "Object"
  }},
  {sortBy:"processVariable",label:"Status", sortOrder:" ", 
    "parameters":{
      "variable" : "documentStatus",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Lawyer Name", sortOrder:" ", 
    "parameters":{
      "variable" : "lawyerName",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Registry", sortOrder:" ", 
    "parameters":{
      "variable" : "registry",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Document Type", sortOrder:" ", 
    "parameters":{
      "variable" : "documentType",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Served Date ISO", sortOrder:" ", 
    "parameters":{
      "variable" : "serveDateInISOFormat",
      "type" : "String"
  }}
];

export const searchData = [
  {"label": "Task Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Definition Name", "compares": ["like", "="], "values": ["processDefinitionNameLike", "processDefinitionName"]},
  {"label": "Assignee", "compares": ["like", "="], "values": ["assigneeLike", "assignee"]},
  {"label":"Candidate Group", "compares": ["="], "values": ["candidateGroup"]},
  {"label":"Candidate User", "compares": ["="], "values": ["candidateUser"]},
  {"label":"Name", "compares": ["like", "="], "values": ["nameLike", "name"]},
  {"label": "Description","compares": ["like", "="], "values": ["descriptionLike", "description"] },
  {"label":"Priority", "compares": ["="], "values": ["priority"]},
  {"label":"Due Date", "compares": ["before", "after"], "values": ["due"]},
  {"label":"Follow up Date", "compares": ["before", "after"], "values": ["followUp"]},
  {"label":"Modified", "compares": ["before", "after"], "values": ["created"]},
]

export const Filter_Search_Types = {
  VARIABLES:"variables",
  STRING:"string",
  DATE:"date",
  NORMAL:"normal"
}


export const FILTER_OPERATOR_TYPES = {
  EQUAL:"=",
  LIKE:"like",
  BEFORE:"before",
  AFTER:"after"
}

//TODO update to further constants
export const FILTER_COMPARE_OPTIONS = {
  [Filter_Search_Types.VARIABLES]:[">", ">=", FILTER_OPERATOR_TYPES.EQUAL ,"!=", "<", "<=",FILTER_OPERATOR_TYPES.LIKE],
  [Filter_Search_Types.DATE]:[FILTER_OPERATOR_TYPES.BEFORE, FILTER_OPERATOR_TYPES.AFTER],
  [Filter_Search_Types.STRING]:[FILTER_OPERATOR_TYPES.EQUAL,FILTER_OPERATOR_TYPES.LIKE],
  [Filter_Search_Types.NORMAL]:[FILTER_OPERATOR_TYPES.EQUAL]
};

export const taskFilters = [
  {label:"Process Variables",key:"processVariables", operator:FILTER_OPERATOR_TYPES.EQUAL, type:Filter_Search_Types.VARIABLES, value:"", name:""},
  {label:"Task Variables", key:"taskVariables",operator:FILTER_OPERATOR_TYPES.EQUAL, type:Filter_Search_Types.VARIABLES, value:"", name:""},
  {label:"Process Definition Name",key:"processDefinitionName", operator:FILTER_OPERATOR_TYPES.LIKE, type:Filter_Search_Types.STRING, value:"" },
  {label:"Assignee",key:"assignee",operator:FILTER_OPERATOR_TYPES.LIKE, type:Filter_Search_Types.STRING,value:"", },
  {label:"Candidate Group",key:"candidateGroup",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Candidate User",key:"candidateUser",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Name",key:"name",operator:FILTER_OPERATOR_TYPES.LIKE,type:Filter_Search_Types.STRING,value:""},
  {label:"Description",key:"description",operator:FILTER_OPERATOR_TYPES.LIKE,type:Filter_Search_Types.STRING, value:""},
  {label:"Priority",key:"priority",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Due Date",key:"due",operator:FILTER_OPERATOR_TYPES.BEFORE, type:Filter_Search_Types.DATE, value:""},
  {label:"Follow up Date",key:"followUp",operator:FILTER_OPERATOR_TYPES.BEFORE, type:Filter_Search_Types.DATE, value:""},
  {label:"Modified",key:"created",operator:FILTER_OPERATOR_TYPES.BEFORE,type:Filter_Search_Types.DATE, value:"" },
];

export const ALL_TASKS="All tasks"
export const QUERY_TYPES= {ANY:"ANY",ALL:"ALL"};
export const MAX_RESULTS= 30; //maxResults

export const DOCUMENT_STATUS = 0;
export const PARTY_NAME = 1;
export const IS_CRIMINAL = 2;
export const NEXT_APPEARANCE_DATE = 3;
export const DOCUMENT_TYPE = 4;
export const STAFF_GROUP = 5; 
export const COURT_OR_TRIBUNAL_FILE_NUMBER = 6;
export const DATE_SERVED = 7;
export const DATE_SERVED_IN_ISO_FORMAT = 8;
export const LAWYER_NAME = 9;
export const REGISTRY = 10;

// Define list of table headers that need to be displayed
// Order matters, should map to order of table columns left -> right
export const TABLE_HEADERS = [
  {label:'Party',key:'partyName'},
  {label:'Status',key:'documentStatus'},
  {label:'Responsibility',key:'staffGroup'},
  {label:'Criminal Matter',key:'isCriminal'},
  {label:'Court/Tribunal File #',key:'courtOrTribunalFileNbr'},
  {label:'Date Served',key:'dueDate'},
  {label:'Next Appearance Date',key:'nextAppearanceDate'},
  {label:'Registry',key:'registry'},
  {label:'Document Type',key:'documentType'},
  {label:'Lawyer',key:'lawyerName'},
  {label:'Edited by',key:'assignee'},
  {label:'View/Edit Form',key:''},
];

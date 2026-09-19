// Approximate outdoor starting points, checked against the NUS campus directory
// and map. Refine from the location description during offline data preparation.
export const publicPlaces = [
  {id:'central-library',name:'Central Library exterior',latitude:1.296290,longitude:103.773430},
  {id:'town-plaza',name:'UTown Town Plaza exterior',latitude:1.304280,longitude:103.773630},
  {id:'kent-ridge-mrt',name:'Kent Ridge MRT bus stop',latitude:1.294812,longitude:103.784359},
  {id:'town-green',name:'UTown Town Green',latitude:1.305350,longitude:103.773150},
  {id:'erc',name:'Education Resource Centre exterior',latitude:1.305980,longitude:103.772620},
  {id:'yih',name:'Yusof Ishak House exterior',latitude:1.298540,longitude:103.774620},
  {id:'the-deck',name:'The Deck exterior',latitude:1.294720,longitude:103.772130},
  {id:'ucc',name:'University Cultural Centre exterior',latitude:1.301200,longitude:103.772250},
] as const;

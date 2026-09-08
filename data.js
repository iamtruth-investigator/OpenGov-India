window.OpenGovData = (() => {
  const projects = [
    {id:'AS-JOR-RD-2026-0142',type:'Roads',title:'Jorhat–Titabor Road Improvement',place:'Jorhat, Assam',budget:18.4,approved:18.4,released:14.2,utilized:10.8,progress:72,status:'On Track',department:'Public Works Department',contractor:'Demo Infrastructure Ltd.',start:'10 Jan 2026',end:'30 Dec 2026'},
    {id:'AS-SIV-SCH-2026-0081',type:'Education',title:'Government School Infrastructure Upgrade',place:'Sivasagar, Assam',budget:4.8,approved:4.8,released:3.1,utilized:2.2,progress:48,status:'In Progress',department:'Education Department',contractor:'Demo BuildWorks',start:'05 Feb 2026',end:'15 Nov 2026'},
    {id:'AS-TEZ-WTR-2026-0037',type:'Water',title:'Rural Drinking Water Network',place:'Tezpur, Assam',budget:7.2,approved:7.2,released:6.8,utilized:6.1,progress:91,status:'Near Completion',department:'Public Health Engineering',contractor:'Demo Water Systems',start:'20 Jan 2026',end:'20 Sep 2026'},
    {id:'AS-JOR-HOS-2026-0064',type:'Healthcare',title:'Primary Health Centre Expansion',place:'Jorhat, Assam',budget:12.6,approved:12.6,released:8.4,utilized:4.4,progress:35,status:'In Progress',department:'Health & Family Welfare',contractor:'Demo Healthcare Projects',start:'18 Mar 2026',end:'28 Feb 2027'},
    {id:'AS-TIT-RD-2026-0118',type:'Roads',title:'Village Connectivity Road',place:'Titabor, Assam',budget:3.1,approved:3.1,released:2,utilized:1,progress:22,status:'Delayed',department:'Rural Development Department',contractor:'Demo Roads & Works',start:'01 Apr 2026',end:'30 Nov 2026'},
    {id:'AS-GOL-INF-2026-0029',type:'Infrastructure',title:'Community Market Development',place:'Golaghat, Assam',budget:5.6,approved:5.6,released:4.2,utilized:3.5,progress:64,status:'On Track',department:'Urban Development',contractor:'Demo Civic Works',start:'12 Feb 2026',end:'31 Dec 2026'}
  ];
  const citizenReports = [
    {id:'CR-2026-0012',project:'AS-TIT-RD-2026-0118',title:'Road work appears stalled',place:'Titabor, Assam',status:'Under Review',date:'02 Sep 2026'},
    {id:'CR-2026-0018',project:'AS-JOR-RD-2026-0142',title:'Drainage work needs inspection',place:'Jorhat, Assam',status:'Forwarded',date:'04 Sep 2026'},
    {id:'CR-2026-0021',project:'AS-SIV-SCH-2026-0081',title:'School construction progress update requested',place:'Sivasagar, Assam',status:'Responded',date:'05 Sep 2026'}
  ];
  return {projects, citizenReports};
})();

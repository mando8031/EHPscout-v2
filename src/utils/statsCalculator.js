export function calculateTeamStats(data){

  const grouped={}

  data.forEach(entry=>{

    if(!grouped[entry.team]){

      grouped[entry.team]=[]

    }

    grouped[entry.team].push(entry)

  })

  return Object.keys(grouped).map(team=>{

    const entries=grouped[team]

    const avg=(key)=>

      entries.reduce((sum,e)=>sum+Number(e[key]),0)/entries.length

    return{

      team,
      accuracy:avg("accuracy"),
      auton:avg("auton"),
      movement:avg("movement"),
      intake:avg("intake"),
      climb:avg("climb"),
      overall:avg("overall")

    }

  })

}

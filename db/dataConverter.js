fs = require('fs');

console.log("To run this: node dataConverter file.csv file.sql");
console.log("Note: will start at the second line of the CSV, removing the header.");
tableName = process.argv[2];
fileIn = process.argv[3];
fileOut = process.argv[4];

sql = "INSERT INTO " + tableName + " VALUES\n";

inputFile = fs.readFileSync(fileIn,'utf-8').toString();
inputFile = inputFile.split('\n');

//Skips header by starting on line 1
for(i = 1; i < inputFile.length; i++){
  line = inputFile[i].split(',');
  sql += "(";
  for(j = 0; j < line.length; j++){
    line[j] = line[j].replace(/(?:\r\n|\r|\n)/g, '');
    if(line[j] % 1 === 0){
      sql += line[j] + ",";
    }
    else if(line[j][0] === '"'){
    //console.log(line[j] + " " + line[j][0]);
      sql += "'" + line[j];
      j++;
      while(j < line.length && line[j][line[j].length-1] != '"'){
         sql += line[j];
         j++;
      }
      sql += line[j] + "',";
    }
    else if(line[j].toLowerCase() === "true" || line[j].toLowerCase() === "false"){
      sql += line[j] + ",";
    }
    else if(line[j] === ""){
      //Skip
    }
    else{
      sql += "'" + line[j] + "',";
    }
  }
  sql = sql.substring(0,sql.length-1);
  sql += "),\n";
}

sql = sql.substring(0,sql.length-1);
sql += ";";

sql = sql.replace(/,,,/g, '');

fs.writeFileSync(fileOut,sql,'utf-8');
console.log("Done. Run 'sudo -i -u postgres', provide the password, and run 'psql -d credit_transfer -f /home/unnamed/capping-project/db/" + fileOut + "'.");
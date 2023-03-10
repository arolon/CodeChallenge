function autoFillIPSTemplateGoogleDoc(e) {
  // declare variables from Google Sheet
  let investorName = e.values[1];
  let timeStamp = e.values[0];
  let emailID = e.values[2]

  // convert values from column 3 of Google Sheet to string
  const goals = e.values[4].toString();

  // declare goal variables
  let goal1 = ""
  let goal2 = ""
  let goal3 = ""

  //create an array and parse values from CSV format, store them in an array
  goalsArr = goals.split(',')
  if (goalsArr.length >= 1)
    goal1 = stringToNumber(goalsArr[0])
  if (goalsArr.length >= 2)
    goal2 = stringToNumber(goalsArr[1])
  if (goalsArr.length >= 3)
    goal3 = stringToNumber(goalsArr[2])

//grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);

//grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID)

//create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + ' Investment Policy', folder);

//modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());

  var body = doc.getBody();

  body.replaceText('%InvestorName%', investorName);
  body.replaceText('%Date%', timeStamp);

  body.replaceText('%Goal1%', goal1)
  body.replaceText('%Goal2%', goal2)
  body.replaceText('%Goal3%', goal3)

  doc.saveAndClose();

//find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}

//Function that receives a string and convert it into a number
function stringToNumber(str) {
    let result;
    //Check if the number in the string has decimal
    if (str.includes(".") || str.includes(",")) {
        res = parseFloat(str);
    } else {
        res = parseInt(str);
    }
    //return the number if is a number or the string with a message in case is not
    return isNaN(res)?str+" is not a number":res;
}
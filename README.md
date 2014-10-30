HTML Checklist
====================

Simple single-page interactive checklist which retrieves JSON data from a published Google Docs spreadsheet.

Extend
------
To extend this checklist for your own purposes you'll just need to create and publish your own spreadsheet on Google Documents.

You can use [this one](https://docs.google.com/spreadsheets/d/1bz4mDdN6-f-FeEy2wpQaQaGygQ4hOa6BbpUiEeQpttc/pubhtml) as an example of how the spreadsheet should be formatted.

## Using the same columns

If you use the same column headers as in the example, then there's not much you need to do..

 1. After writing your spreadsheet; within Google Docs, select File -> Publish to the Web ->.  Select the Link tab which will be preselected by default and ensure that the checkbox "Automatically republish .." is checked.
 2. Copy the URL that is generated and find the unique portion which defines your spreadsheet..
 
     Example: https://docs.google.com/spreadsheets/d/1bz4mDdN6-f-FeEy2wpQaQaGygQ4hOa6BbpUiEeQpttc/pubhtml
                                                    |------------------This part----------------|
                                                    
 3. In `main.js` change the variable `spreadsheet` to the portion you just copied.
 
## Change column headers

  1. Google will automatically remove any spaces, as well as any characters other than a-z, and will lowercase all characters; to generate the id's for each column.  These look like this:  `gsx$stepnum`.
  2. So if you change the column header names just open up `main.js` and replace those values with the alternative names you want to use.
  
## Change sheets

  - To access individual sheets within a spreadsheet, you use an ID in the URI.  On lines 3-5 you'll notice these id's assigned to variables along with the spreadsheet id.
  - The first sheet is always assigned the variable `od6` so no need to change that one.
  - To find the id's of other sheets, take the URL that Google provides when you publish it go here: 

    https://spreadsheets.google.com/feeds/list/1Rl0hT1_sdnnWOsU3IILrt3dkt7O9G0snd19Y4vXDqBY/od6/public/values

  - You can find the IDs within the code that you will see there.





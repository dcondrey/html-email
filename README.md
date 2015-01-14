# HTML Email Developer Kit

If you are developing HTML email campaigns and want to achieve the highest possible cross-compatibility while also maintaining responsive features for those clients which support it then your in the right place.

## Index

 - Best Practice Checklist
 - Skeleton template structure

---

## Best Practice Checklist

The checklist is a simple single-page interactive checklist which is and of itself also an example of how to query data and use Google Spreadsheets as a quick and easy database.  All of the content is composed and stored in a single Google Spreadsheet comprised of 3 internal tab sections.

#### Extend

To extend this checklist for your own purposes you'll just need to create and publish your own spreadsheet on Google Documents.

You can use [this one](https://docs.google.com/spreadsheets/d/1bz4mDdN6-f-FeEy2wpQaQaGygQ4hOa6BbpUiEeQpttc/pubhtml) as an example of how the spreadsheet should be formatted.

##### Using the same columns

If you use the same column headers as in the example, then there's not much you need to do..

 1. After writing your spreadsheet; within Google Docs, select File -> Publish to the Web ->.  Select the Link tab which will be preselected by default and ensure that the checkbox "Automatically republish .." is checked.
 2. Copy the URL that is generated and find the unique portion which defines your spreadsheet..
 
     Example: https://docs.google.com/spreadsheets/d/1bz4mDdN6-f-FeEy2wpQaQaGygQ4hOa6BbpUiEeQpttc/pubhtml
                                                    |------------------This part----------------|
                                                    
 3. In `main.js` change the variable `spreadsheet` to the portion you just copied.
 
##### Change column headers

  1. Google will automatically remove any spaces, as well as any characters other than a-z, and will lowercase all characters; to generate the id's for each column.  These look like this:  `gsx$stepnum`.
  2. So if you change the column header names just open up `main.js` and replace those values with the alternative names you want to use.
  
##### Change sheets

  - To access individual sheets within a spreadsheet, you use an ID in the URI.  On lines 3-5 you'll notice these id's assigned to variables along with the spreadsheet id.
  - The first sheet is always assigned the variable `od6` so no need to change that one.
  - To find the id's of other sheets, take the URL that Google provides when you publish it go here: 

    https://spreadsheets.google.com/feeds/list/1Rl0hT1_sdnnWOsU3IILrt3dkt7O9G0snd19Y4vXDqBY/od6/public/values

  - You can find the IDs within the code that you will see there.

---

## Skeleton template

this is a skeleton boilerplate template stripped of content, thus it will not look like much as is.  as an example of structure and implementation of best practices to meet the greatest cross-compatibility, it is likely the best template you will find.

Includes example implementation of table cell background images which will render in Outlook and all clients except Gmail, includes web font fallback protection to control which websafe font Outlook uses rather than allowing Outlook to display its default.. Times New Roman.

Controls the styling of alt text, links, and dates.

Fully responsive in all clients capable of responsive rendering including Windows Phone 7 - 8, Android, iOS, Blackberry, and others.

Collapsing structure to display as best as possible whether images are loaded or not.

---

I will eventually draft up a wiki for this and include some complete campaign examples.




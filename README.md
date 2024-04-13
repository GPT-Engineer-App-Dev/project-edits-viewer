# project-edits-viewer

Implement an internal tool with the following features:

1. A form that allows the user to upload a CSV file. The CSV will contain data about code edits to various projects.

2. When the CSV is uploaded, parse the data and filter to only include rows where the "type" column equals "ai_update". 

3. Extract the project ID from each row. The project ID is the first ID in the "__path__" column.

4. Display a dropdown menu populated with the unique project IDs extracted in step 3. 

5. When the user selects a project ID from the dropdown:
   - Filter the data to only include rows for the selected project
   - Display the filtered rows in a list, sorted by the "__created__" column
   - For each row, show:
     - The content from the "tags.output" column, pretty printed
     - The "commit_sha" value, but only if the "status" column is not "failed"

Use Chakra UI components for the layout and styling. Let me know if you have any questions!

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with REPLACE_WITH_TECH_STACK_SUMMARY.

REPLACE_WITH_TECH_STACK_POINTS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App-Dev/project-edits-viewer.git
cd project-edits-viewer
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

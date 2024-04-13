import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Select, List, ListItem, Text, Code, VStack, HStack } from "@chakra-ui/react";

const Index = () => {
  const [data, setData] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const parseCsv = (csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j];
        }
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target.result;
      const results = parseCsv(csv);
      const filteredData = results.filter((row) => row.type === "ai_update");
      setData(filteredData);

      const uniqueProjectIds = [...new Set(filteredData.map((row) => row.__path__.split("/")[1]))];
      setProjectIds(uniqueProjectIds);
    };

    reader.readAsText(file);
  };

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const filteredRows = data.filter((row) => row.__path__.split("/")[1] === selectedProjectId);

  return (
    <Box p={4}>
      <FormControl>
        <FormLabel>Upload CSV</FormLabel>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </FormControl>

      {projectIds.length > 0 && (
        <VStack align="stretch" mt={4}>
          <Select placeholder="Select a project" value={selectedProjectId} onChange={handleProjectChange}>
            {projectIds.map((projectId) => (
              <option key={projectId} value={projectId}>
                {projectId}
              </option>
            ))}
          </Select>

          {selectedProjectId && (
            <List spacing={4}>
              {filteredRows
                .sort((a, b) => a.__created__ - b.__created__)
                .map((row, index) => (
                  <ListItem key={index}>
                    <VStack align="start">
                      <Code whiteSpace="pre-wrap">{JSON.stringify(JSON.parse(row["tags.output"]), null, 2)}</Code>
                      {row.status !== "failed" && (
                        <HStack>
                          <Text fontWeight="bold">Commit SHA:</Text>
                          <Text>{row.commit_sha}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </ListItem>
                ))}
            </List>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Index;

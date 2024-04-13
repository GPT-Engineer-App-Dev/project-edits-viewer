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
      const parsedData = parseCsv(csv);
      setData(parsedData);

      const uniqueProjectIds = [
        ...new Set(
          parsedData
            .map((row) => {
              const pathParts = row.__path__.split("/");
              return pathParts.length > 1 ? pathParts[1] : "";
            })
            .filter(Boolean),
        ),
      ];
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
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">Edit ID: {row.__id__}</Text>
                        {row.tags && typeof row.tags === "string" ? (
                          <Code whiteSpace="pre-wrap" p={2} borderWidth={1} borderRadius="md">
                            {(() => {
                              console.log("Attempting to parse tags:", row.tags);
                              const trimmedTags = row.tags.trim();
                              try {
                                const parsed = JSON.parse(trimmedTags);
                                return JSON.stringify(parsed, null, 2);
                              } catch (error) {
                                return `Invalid tags JSON: ${error.message}. 
                                  Attempted to parse: ${trimmedTags}`;
                              }
                            })()}
                          </Code>
                        ) : (
                          <Text>No tags data available</Text>
                        )}
                      </VStack>
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

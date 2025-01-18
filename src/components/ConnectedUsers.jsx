// src/components/ConnectedUsers.jsx

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const randomColor = () => {
  const colors = ["#e91e63", "#9c27b0", "#f44336", "#3f51b5", "#ff5722", "#009688"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[3],
}));

export default function ConnectedUsers({ users = [], projectId }) {
  return (
    <StyledCard>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Connected Users
          </Typography>
        }
        subheader={
          <Typography variant="subtitle2" color="text.secondary">
            Project: {projectId || "N/A"}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        {users.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No users connected yet.
          </Typography>
        ) : (
          <List disablePadding>
            {users.map((user, index) => {
              const avatarLetter = user.username
                ? user.username.charAt(0).toUpperCase()
                : "?";
              return (
                <Box key={index}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: randomColor() }}>
                        {avatarLetter}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 500 }}>
                          {user.username || "Unknown"}
                        </Typography>
                      }
                      secondary={user.role ? `Role: ${user.role}` : "Online"}
                    />
                  </ListItem>
                  {index < users.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              );
            })}
          </List>
        )}
      </CardContent>
    </StyledCard>
  );
}

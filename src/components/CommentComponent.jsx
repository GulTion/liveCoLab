import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const CommentComponent = () => {
  const [comments, setComments] = useState([
    { username: "Alice", message: "Hi, this is a great feature!" },
    { username: "Bob", message: "I agree, very useful!" },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    if (newComment.trim() !== "") {
      setComments([
        ...comments,
        { username: "You", message: newComment.trim() },
      ]);
      setNewComment(""); // Clear input field
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        margin: "0 auto",
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Inbox Section */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Inbox
      </Typography>
      <List sx={{ maxHeight: 300, overflowY: "auto" }}>
        {comments.map((comment, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={<strong>{comment.username}</strong>}
                secondary={comment.message}
              />
            </ListItem>
            {index < comments.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          marginTop: 2,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your comment here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ marginRight: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendComment}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CommentComponent;

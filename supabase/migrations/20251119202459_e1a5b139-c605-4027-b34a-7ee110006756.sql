-- Ensure REPLICA IDENTITY FULL is set for messages table (for complete realtime data)
ALTER TABLE messages REPLICA IDENTITY FULL;
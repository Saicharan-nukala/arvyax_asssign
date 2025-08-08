const Session = require('../models/Session');

// Create a new session (draft)
exports.createSession = async (req, res) => {
  try {
    const { title, tags, jsonUrl } = req.body;
    const userId = req.user.id;

    const session = await Session.create({
      user: userId,
      title,
      tags,
      jsonUrl,
      status: 'draft'
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ msg: 'Error creating session', error: err.message });
  }
};

// Get all sessions for authenticated user
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({ user: userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ msg: 'Error fetching sessions', error: err.message });
  }
};

// Get a single session by ID (must belong to user)
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    res.json(session);
  } catch (err) {
    console.error('Get session by ID error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid session ID format' });
    }
    res.status(500).json({ msg: 'Error fetching session', error: err.message });
  }
};

// Update a session (save draft or publish)
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const { title, tags, jsonUrl, status } = req.body;

    session.title = title ?? session.title;
    session.tags = tags ?? session.tags;
    session.jsonUrl = jsonUrl ?? session.jsonUrl;
    
    if (status && ['draft', 'published'].includes(status)) {
      session.status = status;
    }

    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid session ID format' });
    }
    res.status(500).json({ msg: 'Error updating session', error: err.message });
  }
};

// Delete a session - FIXED VERSION
exports.deleteSession = async (req, res) => {
  try {
    console.log('Delete request for session:', req.params.id);
    console.log('User:', req.user.id);

    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Use findByIdAndDelete instead of session.remove()
    await Session.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Session deleted successfully' });
  } catch (err) {
    console.error('Delete session error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid session ID format' });
    }
    res.status(500).json({ msg: 'Error deleting session', error: err.message });
  }
};

// Get all published sessions (public)
exports.getPublishedSessions = async (req, res) => {
  try {
    console.log('Fetching published sessions...');
    const sessions = await Session.find({ status: 'published' })
      .populate('user', 'username')
      .sort({ updatedAt: -1 });
    
    console.log('Found published sessions:', sessions.length);
    res.json(sessions);
  } catch (err) {
    console.error('Get published sessions error:', err);
    res.status(500).json({ msg: 'Error fetching published sessions', error: err.message });
  }
};

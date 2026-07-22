const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// POST /api/pages/:page_name - Set page content
router.post('/:page_name', async (req, res) => {
  try {
    const { page_name } = req.params;
    let page = await Page.findOne({ page_name });
    
    if (page) {
      page.content = req.body;
      page.updatedAt = Date.now();
    } else {
      page = new Page({ page_name, content: req.body });
    }
    
    await page.save();
    res.json(page);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/pages/:page_name - Get page content
router.get('/:page_name', async (req, res) => {
  try {
    const { page_name } = req.params;
    const page = await Page.findOne({ page_name });
    
    if (!page) {
      return res.status(404).json({ msg: 'Page not found' });
    }
    
    res.json(page.content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

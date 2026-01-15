// Knowledge Graph Lite - Auto-link content across different types
export const knowledgeGraph = {
  // Link types
  LINK_TYPES: {
    NOTE_TO_TASK: 'note_to_task',
    TASK_TO_NOTE: 'task_to_note',
    DICTIONARY_TO_NOTE: 'dictionary_to_note',
    DOCUMENT_TO_SUMMARY: 'document_to_summary',
    REMINDER_TO_TASK: 'reminder_to_task',
    CHAT_TO_NOTE: 'chat_to_note'
  },

  // Storage key for links
  STORAGE_KEY: 'knowledge_graph_links',

  // Get all links
  getLinks: () => {
    try {
      const links = localStorage.getItem(knowledgeGraph.STORAGE_KEY);
      return links ? JSON.parse(links) : [];
    } catch (error) {
      console.error('Error reading knowledge graph links:', error);
      return [];
    }
  },

  // Save links
  saveLinks: (links) => {
    try {
      localStorage.setItem(knowledgeGraph.STORAGE_KEY, JSON.stringify(links));
      return true;
    } catch (error) {
      console.error('Error saving knowledge graph links:', error);
      return false;
    }
  },

  // Create a link between two entities
  createLink: (sourceType, sourceId, targetType, targetId, linkType, metadata = {}) => {
    const links = knowledgeGraph.getLinks();
    const newLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceType,
      sourceId,
      targetType,
      targetId,
      linkType,
      metadata,
      createdAt: new Date().toISOString(),
      strength: 1 // Link strength (can be increased with more connections)
    };
    
    // Check if link already exists
    const existingLink = links.find(link => 
      link.sourceType === sourceType && 
      link.sourceId === sourceId && 
      link.targetType === targetType && 
      link.targetId === targetId
    );
    
    if (existingLink) {
      // Increase strength of existing link
      existingLink.strength += 1;
      existingLink.metadata = { ...existingLink.metadata, ...metadata };
    } else {
      links.push(newLink);
    }
    
    knowledgeGraph.saveLinks(links);
    return existingLink || newLink;
  },

  // Remove a link
  removeLink: (linkId) => {
    const links = knowledgeGraph.getLinks();
    const filteredLinks = links.filter(link => link.id !== linkId);
    knowledgeGraph.saveLinks(filteredLinks);
    return true;
  },

  // Get links for a specific entity
  getLinksForEntity: (entityType, entityId) => {
    const links = knowledgeGraph.getLinks();
    return links.filter(link => 
      (link.sourceType === entityType && link.sourceId === entityId) ||
      (link.targetType === entityType && link.targetId === entityId)
    );
  },

  // Auto-detect and create links based on content similarity
  autoLinkContent: (content, entityType, entityId) => {
    const links = [];
    
    // Get all existing content to compare against
    const notes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
    const tasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
    const dictionaryHistory = JSON.parse(localStorage.getItem('dictionaryHistory') || '[]');
    
    // Extract keywords from content
    const keywords = knowledgeGraph.extractKeywords(content);
    
    // Link to notes with similar content
    if (entityType !== 'note') {
      notes.forEach(note => {
        const similarity = knowledgeGraph.calculateSimilarity(content, note.content);
        if (similarity > 0.3) { // 30% similarity threshold
          const link = knowledgeGraph.createLink(
            entityType, entityId,
            'note', note.id,
            knowledgeGraph.LINK_TYPES.NOTE_TO_TASK,
            { similarity, keywords: keywords.slice(0, 5) }
          );
          links.push(link);
        }
      });
    }
    
    // Link to tasks with similar content
    if (entityType !== 'task') {
      tasks.forEach(task => {
        const taskContent = `${task.title} ${task.description || ''}`;
        const similarity = knowledgeGraph.calculateSimilarity(content, taskContent);
        if (similarity > 0.3) {
          const link = knowledgeGraph.createLink(
            entityType, entityId,
            'task', task.id,
            knowledgeGraph.LINK_TYPES.TASK_TO_NOTE,
            { similarity, keywords: keywords.slice(0, 5) }
          );
          links.push(link);
        }
      });
    }
    
    // Link to dictionary words mentioned in content
    if (entityType !== 'dictionary') {
      dictionaryHistory.forEach(entry => {
        if (content.toLowerCase().includes(entry.word.toLowerCase())) {
          const link = knowledgeGraph.createLink(
            entityType, entityId,
            'dictionary', entry.word,
            knowledgeGraph.LINK_TYPES.DICTIONARY_TO_NOTE,
            { word: entry.word, definition: entry.meanings?.[0]?.definitions?.[0]?.definition }
          );
          links.push(link);
        }
      });
    }
    
    return links;
  },

  // Extract keywords from text
  extractKeywords: (text) => {
    if (!text) return [];
    
    // Simple keyword extraction (can be enhanced with NLP libraries)
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  },

  // Calculate content similarity (simple Jaccard similarity)
  calculateSimilarity: (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(knowledgeGraph.extractKeywords(text1));
    const words2 = new Set(knowledgeGraph.extractKeywords(text2));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  },

  // Get related content for an entity
  getRelatedContent: (entityType, entityId) => {
    const links = knowledgeGraph.getLinksForEntity(entityType, entityId);
    const related = {
      notes: [],
      tasks: [],
      dictionary: [],
      documents: [],
      reminders: []
    };
    
    links.forEach(link => {
      const isSource = link.sourceType === entityType && link.sourceId === entityId;
      const relatedType = isSource ? link.targetType : link.sourceType;
      const relatedId = isSource ? link.targetId : link.sourceId;
      
      // Get the actual content based on type
      let content = null;
      switch (relatedType) {
        case 'note':
          const notes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
          content = notes.find(note => note.id === relatedId);
          if (content) related.notes.push({ ...content, linkMetadata: link.metadata });
          break;
        case 'task':
          const tasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
          content = tasks.find(task => task.id === relatedId);
          if (content) related.tasks.push({ ...content, linkMetadata: link.metadata });
          break;
        case 'dictionary':
          const dictionaryHistory = JSON.parse(localStorage.getItem('dictionaryHistory') || '[]');
          content = dictionaryHistory.find(entry => entry.word === relatedId);
          if (content) related.dictionary.push({ ...content, linkMetadata: link.metadata });
          break;
      }
    });
    
    return related;
  },

  // Get content suggestions based on current context
  getSuggestions: (currentContent, entityType) => {
    const keywords = knowledgeGraph.extractKeywords(currentContent);
    const suggestions = {
      relatedNotes: [],
      relatedTasks: [],
      relatedWords: [],
      suggestedActions: []
    };
    
    // Find related content based on keywords
    const notes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
    const tasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
    const dictionaryHistory = JSON.parse(localStorage.getItem('dictionaryHistory') || '[]');
    
    // Suggest related notes
    notes.forEach(note => {
      const similarity = knowledgeGraph.calculateSimilarity(currentContent, note.content);
      if (similarity > 0.2) {
        suggestions.relatedNotes.push({
          ...note,
          similarity,
          reason: 'Similar content'
        });
      }
    });
    
    // Suggest related tasks
    tasks.forEach(task => {
      const taskContent = `${task.title} ${task.description || ''}`;
      const similarity = knowledgeGraph.calculateSimilarity(currentContent, taskContent);
      if (similarity > 0.2) {
        suggestions.relatedTasks.push({
          ...task,
          similarity,
          reason: 'Similar content'
        });
      }
    });
    
    // Suggest dictionary words
    keywords.forEach(keyword => {
      const relatedWords = dictionaryHistory.filter(entry => 
        entry.word.toLowerCase().includes(keyword) || 
        keyword.includes(entry.word.toLowerCase())
      );
      suggestions.relatedWords.push(...relatedWords);
    });
    
    // Suggest actions based on content
    if (keywords.some(word => ['todo', 'task', 'do', 'complete', 'finish'].includes(word))) {
      suggestions.suggestedActions.push({
        type: 'create_task',
        title: 'Create Task',
        description: 'This content mentions tasks - would you like to create a task?'
      });
    }
    
    if (keywords.some(word => ['remember', 'remind', 'later', 'tomorrow'].includes(word))) {
      suggestions.suggestedActions.push({
        type: 'create_reminder',
        title: 'Create Reminder',
        description: 'This content mentions reminders - would you like to set a reminder?'
      });
    }
    
    // Sort suggestions by relevance
    suggestions.relatedNotes.sort((a, b) => b.similarity - a.similarity);
    suggestions.relatedTasks.sort((a, b) => b.similarity - a.similarity);
    
    return suggestions;
  },

  // Get knowledge graph statistics
  getStats: () => {
    const links = knowledgeGraph.getLinks();
    const stats = {
      totalLinks: links.length,
      linksByType: {},
      strongestLinks: [],
      mostConnectedEntities: {}
    };
    
    // Count links by type
    links.forEach(link => {
      stats.linksByType[link.linkType] = (stats.linksByType[link.linkType] || 0) + 1;
    });
    
    // Find strongest links
    stats.strongestLinks = links
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 10);
    
    // Count connections per entity
    links.forEach(link => {
      const sourceKey = `${link.sourceType}:${link.sourceId}`;
      const targetKey = `${link.targetType}:${link.targetId}`;
      
      stats.mostConnectedEntities[sourceKey] = (stats.mostConnectedEntities[sourceKey] || 0) + 1;
      stats.mostConnectedEntities[targetKey] = (stats.mostConnectedEntities[targetKey] || 0) + 1;
    });
    
    return stats;
  },

  // Clear all links
  clearAllLinks: () => {
    localStorage.removeItem(knowledgeGraph.STORAGE_KEY);
    return true;
  }
};

export default knowledgeGraph;
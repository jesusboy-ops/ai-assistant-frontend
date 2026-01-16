// Custom hook for Dictionary functionality
import { useDispatch, useSelector } from 'react-redux';
import { searchWord, addToFavorites, removeFromFavorites } from '../store/slices/dictionarySlice';
import { createNote } from '../store/slices/notesSlice';
import { showToast } from '../utils/toast';

export const useDictionary = () => {
  const dispatch = useDispatch();
  const dictionaryState = useSelector((state) => state.dictionary);

  const searchForWord = async (word) => {
    try {
      await dispatch(searchWord(word)).unwrap();
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const toggleFavorite = (word, definition) => {
    const isFavorited = dictionaryState.favorites.some(fav => fav.word === word);
    
    if (isFavorited) {
      dispatch(removeFromFavorites(word));
      showToast.success('Removed from favorites');
    } else {
      dispatch(addToFavorites({ word, definition }));
      showToast.success('Added to favorites');
    }
  };

  const saveDefinitionToNotes = async (word, definition) => {
    const noteContent = formatDefinitionForNotes(word, definition);
    
    try {
      await dispatch(createNote({
        title: `Dictionary: ${word}`,
        content: noteContent,
        tags: ['dictionary', 'vocabulary']
      })).unwrap();
      showToast.success('Saved to notes');
      return { success: true };
    } catch (error) {
      showToast.error('Failed to save to notes');
      return { success: false, error };
    }
  };

  const formatDefinitionForNotes = (word, definition) => {
    let content = `# ${word}\n\n`;
    
    if (definition.phonetic) {
      content += `**Pronunciation:** ${definition.phonetic}\n\n`;
    }

    definition.meanings?.forEach((meaning, index) => {
      content += `## ${meaning.partOfSpeech}\n\n`;
      
      meaning.definitions?.forEach((def, defIndex) => {
        content += `${defIndex + 1}. ${def.definition}\n`;
        if (def.example) {
          content += `   *Example: ${def.example}*\n`;
        }
        content += '\n';
      });

      if (meaning.synonyms?.length > 0) {
        content += `**Synonyms:** ${meaning.synonyms.join(', ')}\n\n`;
      }

      if (meaning.antonyms?.length > 0) {
        content += `**Antonyms:** ${meaning.antonyms.join(', ')}\n\n`;
      }
    });

    return content;
  };

  return {
    ...dictionaryState,
    searchForWord,
    toggleFavorite,
    saveDefinitionToNotes,
    formatDefinitionForNotes
  };
};

export default useDictionary;
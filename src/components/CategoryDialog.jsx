import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Iconify from './iconify';

export default function CategoryDialog({ 
  open, 
  onClose, 
  categories, 
  selectedCategories, 
  setSelectedCategories, 
  onPublish 
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [usedCategories] = useState(() => 
    categories.filter(cat => cat.count > 0).sort((a, b) => b.count - a.count)
  );

  const handleNewCategory = async () => {
    if (newCategory.trim()) {
      // Add new category API call would go here
      setIsAddingNew(false);
      setNewCategory('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ 
        style: { 
          maxHeight: '85vh',
          width: '500px',
          display: 'flex',
          flexDirection: 'column'
        } 
      }}
    >
      <Card sx={{ 
        p: 4.5,
        pt: 3.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography sx={{
          fontFamily: "DM Serif Display",
          letterSpacing: '-0.45px',
          fontWeight: 800,
          fontSize: '32px',
          mb: 2.5
        }}>
          Select Categories
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(e.target.value)}
            renderValue={(selected) => 
              selected.map(id => categories.find(c => c.id === id)?.name).join(', ')
            }
            sx={{ minHeight: '45px' }}
          >
            {usedCategories.length > 0 && (
              <>
                <MenuItem disabled sx={{ opacity: 0.7, fontSize: '13px' }}>
                  Previously Used Categories
                </MenuItem>
                {usedCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({category.count} posts)
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem disabled sx={{ borderTop: '1px solid #eee' }} />
              </>
            )}
            
            {categories
              .filter(cat => !usedCategories.find(u => u.id === cat.id))
              .map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isAddingNew ? (
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              onKeyPress={(e) => e.key === 'Enter' && handleNewCategory()}
            />
            <Button 
              variant="contained"
              onClick={handleNewCategory}
              sx={(theme) => ({ 
                bgcolor: theme.palette.primary.navBg,
                '&:hover': { bgcolor: theme.palette.primary.navBg }
              })}
            >
              Add
            </Button>
          </Stack>
        ) : (
          <Button
            variant="text"
            onClick={() => setIsAddingNew(true)}
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{ mb: 2, width: 'fit-content', color: 'text.primary' }}
          >
            Add New Category
          </Button>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 'auto', }}>
          <Button 
            fullWidth
            onClick={onClose}
            variant="outlined"
          >
            Skip Categories
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onPublish}
            disabled={selectedCategories.length === 0}
            sx={(theme) => ({ 
                minHeight: 38,
              bgcolor: theme.palette.primary.navBg,
              '&:hover': { bgcolor: theme.palette.primary.navBg }
            })}
          >
            Publish Post
          </Button>
        </Stack>
      </Card>
    </Dialog>
  );
}

CategoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  setSelectedCategories: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
};
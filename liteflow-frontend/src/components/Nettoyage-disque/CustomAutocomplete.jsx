import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';

const Root = styled('div')(({ theme }) => ({
  color: 'rgba(0,0,0,0.85)',
  fontSize: '14px',
  width: '100%',
  marginBottom: '20px'
}));

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  font-weight: 600;
`;

const InputWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
  borderRadius: '4px',
  padding: '4px',
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: '40px',
  '&:hover': {
    borderColor: '#40a9ff',
  },
  '&.focused': {
    borderColor: '#40a9ff',
    boxShadow: '0 0 0 2px rgb(24 144 255 / 0.2)',
  },
  '& input': {
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.85)',
    height: '30px',
    boxSizing: 'border-box',
    padding: '4px 6px',
    width: '0',
    minWidth: '30px',
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },
}));

const StyledTag = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '28px',
  margin: '2px',
  lineHeight: '22px',
  backgroundColor: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: '4px',
  boxSizing: 'content-box',
  padding: '0 8px 0 10px',
  outline: 0,
  overflow: 'hidden',
  '& span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginRight: '8px',
  },
  '& svg': {
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px',
    '&:hover': {
      color: '#ff4d4f',
    }
  },
}));

const Listbox = styled('ul')(({ theme }) => ({
  width: '100%',
  margin: '2px 0 0',
  padding: 0,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: '#fff',
  overflow: 'auto',
  maxHeight: '300px',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgb(0 0 0 / 0.15)',
  zIndex: 1000,
  '& li': {
    padding: '8px 12px',
    display: 'flex',
    cursor: 'pointer',
    '& span': {
      flexGrow: 1,
    },
    '& svg': {
      color: 'transparent',
    },
  },
  '& li.group-header': {
    backgroundColor: '#f5f5f5',
    fontWeight: 600,
    color: '#1890ff',
    cursor: 'default',
    padding: '6px 12px',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  "& li[aria-selected='true']": {
    backgroundColor: '#e6f7ff',
    fontWeight: 600,
    '& svg': {
      color: '#1890ff',
    },
  },
  [`& li.${autocompleteClasses.focused}:not(.group-header)`]: {
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
  },
}))

function CustomAutocomplete({ value, onChange }) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: value,
    value: value,
    onChange: (event, newValue) => onChange(newValue),
    getOptionLabel: (option) => {
      if (!option || !option.disque || !option.type || option.taille === undefined) {
        return '';
      }
      return `${option.disque} - ${option.type} (${option.taille} Go)`;
    },
    groupBy: (option) => option?.disque || '',
    isOptionEqualToValue: (option, value) => option?.id === value?.id,
  });

  const handleDeleteTag = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleClearAll = () => {
    onChange([]); // Vide tous les éléments
  };

  return (
    <Root>
      <div {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.map((option, index) => {
            if (!option || !option.disque || !option.type || option.taille === undefined) {
              return null;
            }
            return (
              <StyledTag key={option.id}>
                <span>{option.disque} - {option.type} ({option.taille} Go)</span>
                <CloseIcon onClick={() => handleDeleteTag(index)} />
              </StyledTag>
            );
          })}
          <input {...getInputProps()} placeholder="Selectionnez les partitions à supprimer" />
        </InputWrapper>
      </div>

      {/* Bouton en dehors de l'autocomplete */}
      {value.length > 0 && (
        <button
          style={{
            marginTop: '10px',
            border: 'none',
            background: '#ff4d4f',
            color: '#fff',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
          onClick={handleClearAll}
        >
         Effacer les valeurs selectionnées
        </button>
      )}

      {groupedOptions.length > 0 && focused ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            if (typeof option === 'string') {
              return (
                <li key={`group-${option}`} className="group-header">
                  {option}
                </li>
              );
            }

            if (!option || !option.disque || !option.type || option.taille === undefined) {
              return null;
            }

            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key || `option-${option.id}`} {...optionProps}>
                <span>{option.disque} - {option.type} ({option.taille} Go)</span>
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </Listbox>
      ) : null}
    </Root>
  );
}


export default CustomAutocomplete;
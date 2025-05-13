import React, { useEffect, useState } from 'react';
import './Search.css';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoriesSelect from './CategoriesSelect';
import Title from '../Typography/Title';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

import { Typography, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import PetsIcon from '@mui/icons-material/Pets';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HandymanIcon from '@mui/icons-material/Handyman';

function Auctions() {
  const [itemList, setItemList] = useState([]);
  const [complete, setComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setItemList([]);
    setComplete(false);

    const fetchItems = async () => {
      try {
        let res;
        if (Object.keys(selectedCategory).length <= 0) {
          res = await axios.get(`https://localhost:33123/items`);
        } else {
          res = await axios.get(`https://localhost:33123/items/categories/${selectedCategory.id}`);
        }
        setItemList(res.data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setComplete(true);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const handleChangeRows = (event) => {
    setItemsPerPage(event.target.value);
  };

  const visitedPages = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(itemList.length / itemsPerPage);

  const displayItems = itemList
    .slice(visitedPages, visitedPages + itemsPerPage)
    .map((value, key) => (
      <div className='item' key={key} onClick={() => navigate(`/item/${value.id}`)}>
        <div className='name'>{value.name}</div>
        <div className='body'>
          <img className='lando_image' src={value.coverPhoto} alt="cover" />
        </div>
        <div className='footer gradient-custom'>
          <div style={{ color: '#14b6e3' }}>{value.currently} €</div>
        </div>
      </div>
    ));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      {Object.keys(selectedCategory).length > 0 ? (
        <Title title={selectedCategory.name} />
      ) : (
        <Title title={"Shop by Category"} />
      )}

      <div className="search">
        <div className="container" style={{ marginTop: 3 }}>
          <Header text={<ComputerIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<PhotoCameraIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<HandymanIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<PetsIcon style={{ color: '#00C9FF' }} />} />
          <CategoriesSelect setSelectedCategory={setSelectedCategory} />
          <Header text={<ColorLensIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<SnowboardingIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<TwoWheelerIcon style={{ color: '#00C9FF' }} />} />
          <Header text={<CheckroomIcon style={{ color: '#00C9FF' }} />} />
        </div>

        <div className="search">
          {itemList.length === 0 && complete && (
            <>
              <div className='container' style={{ marginTop: 20 }}>
                <Typography sx={{ fontFamily: 'Futura' }} variant="h4">
                  no auctions found
                </Typography>
              </div>
              <img src='https://indususedcars.com/assets/theme/images/no_result_found.png' alt="no results" />
              <Header text={`Unfortunately there are no current listings for ${selectedCategory.name}`} />
            </>
          )}

          {itemList.length === 0 && !complete && (
            <>
              <div className='container' style={{ marginTop: 10 }}>
                <Typography sx={{ fontFamily: 'Futura' }} variant="h4">
                  Loading
                </Typography>
              </div>
              <img alt="loading" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
            </>
          )}

          {itemList.length !== 0 && (
            <div className="container">
              {displayItems}

              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationButtons"}
                previousLinkClassName={"previousButton"}
                nextLinkClassName={"nextButton"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />

              <div className="container">
                <Detail
                  text={
                    <Box sx={{ minWidth: 100 }}>
                      <FormControl fullWidth>
                        <InputLabel id="select-items-label">Items/Page</InputLabel>
                        <Select
                          labelId="select-items-label"
                          id="items-per-page"
                          value={itemsPerPage}
                          label="Items"
                          onChange={handleChangeRows}
                          variant="standard"
                        >
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Auctions;

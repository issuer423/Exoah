import React, { useEffect, useState } from 'react';
import './Search.css';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import ApplyFilters from './ApplyFilters';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

import RemoveShoppingCartSharpIcon from '@mui/icons-material/RemoveShoppingCartSharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import DoneOutlineSharpIcon from '@mui/icons-material/DoneOutlineSharp';
import AccessTimeFilledSharpIcon from '@mui/icons-material/AccessTimeFilledSharp';
import ClearAllIcon from '@mui/icons-material/ClearAll';

function FilterItems(props) {
  const [finalList, setFinalList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [wordText, setWordText] = useState("");
  const [wordBar, setWordBar] = useState("");

  const [superMax, setSuperMax] = useState(100);
  const [priceRange, setPriceRange] = useState([0, superMax]);

  let navigate = useNavigate();

  useEffect(() => {
    for (let i = 0; i < props.items.length; i++) {
      if (props.items[i].currently > superMax) {
        setSuperMax(props.items[i].currently);
      }
    }
    setItemList(props.items);
    setFinalList(props.items);
    // eslint-disable-next-line
  }, [props.items]);

  useEffect(() => {
    const filtered = itemList.filter(
      (value) => value.currently >= priceRange[0] && value.currently <= priceRange[1]
    );
    setFinalList(filtered);
  }, [priceRange]);

  const filterSearch = (event) => {
    const searchText = event.target.value;
    setWordBar(searchText);

    const newFilteredData = finalList.filter((value) =>
      value.name.toLowerCase().includes(searchText.toLowerCase()) ||
      value.description.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredList(searchText === "" ? [] : newFilteredData);
  };

  const finalSearch = (e) => {
    if (e.key === 'Enter') {
      setWordText(wordBar);
      setFinalList(filteredList);
      clearPressed();
    }
  };

  const clearPressed = () => {
    setFilteredList([]);
    setWordBar("");
  };

  const clearFilters = () => {
    setFinalList(itemList);
    setWordText("");
    setPriceRange([0, superMax]);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 3;
  const visitedPages = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(finalList.length / itemsPerPage);

  const displayItems = finalList
    .slice(visitedPages, visitedPages + itemsPerPage)
    .map((value) => (
      <div className='item' key={value.id} onClick={() => navigate(`/item/${value.id}`)}>
        <div className='name'>{value.name}</div>
        <div className='body'>
          <img alt="cover" className='lando_image' src={value.coverPhoto} />
        </div>
        <div className='footer gradient-custom'>
          {value.state === 'EXPECTED' && (
            <>
              <AccessTimeFilledSharpIcon />
              <div>{value.state}</div>
            </>
          )}
          {value.state === 'AVAILABLE' && (
            <>
              <DoneOutlineSharpIcon />
              <div>{value.state}</div>
            </>
          )}
          {value.state === 'EXPIRED' && (
            <>
              <RemoveShoppingCartSharpIcon />
              <div>{value.state}</div>
            </>
          )}
          {value.state === 'PURCHASED' && (
            <>
              <ShoppingCartSharpIcon />
              <div>{value.state}</div>
            </>
          )}
          <div style={{ color: '#14b6e3' }}>{value.currently} €</div>
        </div>
      </div>
    ));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <div className="search">
        <br />
        {itemList.length !== 0 && (
          <>
            <div className="searchInputs">
              <input
                type="text"
                placeholder="Type to search..."
                value={wordBar}
                onChange={filterSearch}
                onKeyDown={finalSearch}
              />
              <div className="searchIcon">
                {filteredList.length === 0 ? (
                  <SearchIcon id="clearBtn" onClick={finalSearch} />
                ) : (
                  <ClearIcon id="clearBtn" onClick={clearPressed} />
                )}
              </div>

              <ApplyFilters
                max={superMax}
                setPriceRange={setPriceRange}
              />
            </div>

            <div className="searchInputs">
              {wordText !== "" && <Header text={wordText} />}
              {wordText !== "" || priceRange[0] !== 0 || priceRange[1] !== superMax ? (
                <button
                  className='buttonitoReverse'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    width: '114px',
                    height: '28px',
                  }}
                  onClick={clearFilters}
                >
                  Clear Filters&nbsp;<ClearAllIcon id="clearBtn" />
                </button>
              ) : null}
            </div>

            {filteredList.length !== 0 && (
              <div className="searchResult">
                {filteredList.map((value) => (
                  <a
                    className='searchItem'
                    key={value.id}
                    onClick={() => navigate(`/item/${value.id}`)}
                  >
                    <p>
                      {value.name} {value.currently} €
                    </p>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="search">
        {finalList.length === 0 && itemList.length !== 0 && (
          <>
            <br />
            <Detail text="no auctions" />
          </>
        )}
      </div>

      <div className="search">
        {finalList.length !== 0 && (
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
          </div>
        )}
      </div>
    </>
  );
}

export default FilterItems;

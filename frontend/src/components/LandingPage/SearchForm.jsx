import React from 'react';

import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import FilterForm from '../Styled/FilterForm.jsx';
import SearchClearButtons from '../Styled/SearchClearButtons.jsx';
import DatePickersContainer from '../Styled/DatePickersContainer.jsx';
import BasicDatePicker from '../BasicDatePicker.jsx';

const SearchForm = ({
  searchTerm, setSearchTerm,
  minBedrooms, setMinBedrooms,
  maxBedrooms, setMaxBedrooms,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  startDate, setStartDate,
  endDate, setEndDate,
  handleSearch, handleClear,
  sortByRatingHighToLow,
  sortByRatingLowToHigh
}) => {
  return (
    <FilterForm>
      <Input
        sx={{ width: '97%', height: '50px' }}
        fullWidth
        placeholder="Search by name or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
                <SearchClearButtons>
          <Input
            placeholder="Minimum Bedrooms"
            type="number"
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(e.target.value)}
          />
          <Input
            placeholder="Maximum Bedrooms"
            type="number"
            value={maxBedrooms}
            onChange={(e) => setMaxBedrooms(e.target.value)}
          />
          <Input
            placeholder="Minimum Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Maximum Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <DatePickersContainer>
          <BasicDatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
              if (newValue && endDate) {
                if (newValue > endDate) {
                  setEndDate(null);
                }
              }
            }}
          />
          <BasicDatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
              if (newValue && startDate) {
                if (newValue < startDate) {
                  setStartDate(null);
                }
              }
            }}
          />
          </DatePickersContainer>
          </SearchClearButtons>
          <Button size="large" onClick={handleSearch}>Search</Button>
          <Button size="large" onClick={handleClear}>Clear</Button>
          <Button size="large" onClick={sortByRatingHighToLow}>Sort by Rating (High to Low)</Button>
          <Button size="large" onClick={sortByRatingLowToHigh}>Sort by Rating (Low to High)</Button>
    </FilterForm>
  );
};

export default SearchForm;

import React, { Component } from 'react'
import SearchResults from './SearchResult'

const GalleryItem=(props) =><div>Im a card </div>
const Gallery=(props) =><div>Im a Gallery </div>
const SelectedFilters=(props) =><div>Im Selected Filters</div>
const SearchFilter=(props) =><div>Im a Filter </div>
const Spinner=(props) =><div>Loading!!! </div>

export default (props)=>{
    return <SearchResults {...props} 
        //GalleryItem={GalleryItem} 
        //Gallery={Gallery}
        //SearchFilter={SearchFilter}
        Spinner={Spinner}
        //SelectedFilters={SelectedFilters}
    />
}
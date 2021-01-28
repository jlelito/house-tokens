import React, { Component } from 'react';
import PageNav from './PageNav.js'
import Card from './Card.js'

class CurrentHouses extends Component {

    async componentDidMount() {
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.houseList.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentHouses: currentPosts})
    }

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            postsPerPage: 3,
            currentHouses:[]
        }
        this.paginate = this.paginate.bind(this)
    }

    //Change Page
    async paginate (pageNumber) {
        await this.setState({currentPage: pageNumber})
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.houseList.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentHouses: currentPosts})
    }


    render() {
        return (
        <>
        <div className='container-fluid d-flex justify-content-center' id="owned-camps-container">
            <div className='card-group justify-content-center'>
              {this.state.currentHouses.map(house => (
                <>   
                    <div className='row' key={house.id}>
                    <Card
                        key={house.houseID}
                        house={house}
                        changePrice={this.props.changePrice}
                        buyHouse={this.props.buyHouse}
                        account={this.props.account}
                    />
                    </div>  
                </>
                ))}
            </div>
        </div>
        <PageNav 
            postsPerPage={this.state.postsPerPage}
            totalPosts={this.props.houseList.length}
            paginate={this.paginate}
            currentPage={this.state.currentPage}
        />
        </>
        )
    }
}

  export default CurrentHouses;
import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            search: ''
        }
    }

    componentDidMount() {
        this.loadUsers()
        console.log("1111")
    }

    loadUsers = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "search": this.state.search
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            let response = await fetch("http://localhost:4000/api/admin/user/search", requestOptions)
            if (response.ok) {
                let result = await response.json()
                let users = this.state.users.concat(result)
                this.setState({
                    users
                })
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    loadUser = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

        try {
            let response = await fetch("http://localhost:4000/api/admin/user/"+id, requestOptions)
            if (response.ok) {
                let result = await response.json()
                return result;
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    reset = () => {
        this.setState({ users: [] }, this.loadUsers)
    }

    deleteUser = async (id) => {
        if (window.confirm('B???n c?? ch???c ch???n mu???n x??a kh??ng ?')) {
            console.log("delete "+id)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+localStorage.getItem("accessToken"));
    
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };
    
            try {
                let response = await fetch("http://localhost:4000/api/admin/user/"+id, requestOptions)
                if(response.ok) {
                    console.log("delete successful")
                    this.reset()
                }
            } catch (error) {
                console.log("error "+error)
            }
        } else {
            console.log('kh??ng x??a.');
        }
        
    }

    search = (e) => {
        let value = e.target.value
        this.setState({  users: [],search: value }, this.loadUsers)
    }

    enabled = async (e) => {
        console.log('1')
        const id = e.target.id
        const value = e.target.value
        let user = await this.loadUser(id);
        let enabled = null;
        if((value === 'C??')) {
            enabled = true;
        }
        if((value === 'Kh??ng')) {
            enabled = false;
        }
        user.enabled = enabled
        console.log('user ',user)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+localStorage.getItem("accessToken"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(user);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            let response = await fetch("http://localhost:4000/api/admin/user/"+id, requestOptions)
            if(response.ok) {
                console.log('update successful')
                this.reset()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    render() {
        return (
            <>  
                <div className="page-title">
                    <div className="title_left">
                        <h3>DANH S??CH T??I KHO???N NG?????I D??NG</h3>
                    </div>

                    <SearchProduct search={this.search} />
                </div>

                <div className="clearfix"></div>

                <div className="row" >
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_title">
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card-box table-responsive">
                                            <TableCategory data={this.state.users} deleteId={this.deleteUser} enabled={this.enabled}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class TableCategory extends React.Component {
    render() {
        return <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <td>Id</td>
                    <td>T??n</td>
                    <td>Tu???i</td>
                    <td>Vai tr??</td>
                    <td>???????c k??ch ho???t</td>
                    <td>T??i kho???n</td>
                    <td>M???t kh???u</td>
                    <td>?????a ch???</td>
                    <td>Gi???i t??nh</td>
                    <td>S??? ??i???n tho???i</td>
                    <td>email</td>
                    <td>???nh ?????i di???n</td>
                    <td>L???a ch???n</td>
                    <td>K??ch ho???t</td>
                </tr>
            </thead>
            <tbody>
            {
                this.props.data.map(item => {
                    return <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                        <td>{item.role}</td>
                        <td>{item.enabled ? 'C??' : 'Kh??ng'}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td>{item.address}</td>
                        <td>{item.gender}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td><img width="100px" src={'http://localhost:4000/api/download/'+item.avatar} /></td>
                        <td>
                            <button onClick={() => this.props.deleteId(item._id)}>Delete</button>
                        </td>
                        <td>
                            <select id={item._id} value={item.enabled ? 'C??' : 'Kh??ng'} onChange={this.props.enabled}>
                                <option value='C??'>C??</option>
                                <option value='Kh??ng'>Kh??ng</option>
                            </select>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
    }
}


class SearchProduct extends React.Component {
    render() {
        return <>
            <div className="title_right">
                <div className="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                    <form className="input-group">
                        <input type="text" name="search" className="form-control" placeholder="T??m ki???m" onChange={this.props.search}/>
                        {/* <span className="input-group-btn">
                            <button className="btn btn-secondary" type="submit">T??m ki???m</button>
                        </span> */}
                    </form>
                </div>
            </div>
        </>
    }
} 
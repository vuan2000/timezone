const container = document.getElementById("container")
const logoutElement = document.getElementById("account-logout")
const loginElement = document.getElementById("account-login")

const app = {
    isLogin: localStorage.getItem("accessToken") ? true : false,
    user: {},
    bill: {},
    isCoupon: false,
    billProducts: [],
    loadUser: async function () {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('accessToken'));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            let response = await fetch("http://localhost:4000/api/member/me", requestOptions)
            if (response.ok) {
                let result = await response.json()
                console.log(result)
                this.user = result
            }
        } catch (error) {
            console.log('error', error)
        }
    },
    loadMenuAccount: function() {
        if(this.isLogin) {
            logoutElement.classList.add('active')
            loginElement.classList.toggle('active')
        }
    },
    loadBill: async function (id) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            let response = await fetch("http://localhost:4000/api/admin/bill/" + id, requestOptions)
            if (response.ok) {
                let result = await response.json()
                console.log(result)
                this.bill = result
                result.coupon ? (this.isCoupon = true) : (this.isCoupon = false) 
            }
        } catch (error) {
            console.log('error', error)
        }
    },
    loadBillProducts: async function (idBill) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            let response = await fetch("http://localhost:4000/api/admin/bill-product/" + idBill, requestOptions)
            if (response.ok) {
                let result = await response.json()
                console.log(result)
                this.billProducts = result
            }
        } catch (error) {
            console.log('error', error)
        }
    },
    render: async function () {
        let total = await this.billProducts.reduce((total, item, index) => {
            return total + (item.unitPrice*item.quantity);
        }, 0)
        console.log('total ',total)
        let couponReduce = 0;
        if(this.isCoupon) couponReduce = (total - (total * (parseInt(this.bill.couponPresent) / 100) ) );
        console.log(couponReduce)
        const billHtml =`
            <div class="row">
                <div class="col-lg-12">
                <div class="confirmation_tittle">
                    <span>C??m ??n b???n ???? mua h??ng. ????n h??ng c???a b???n ???? ???????c ghi nh???n</span>
                </div>
                </div>
                <div class="col-lg-6 col-lx-4">
                <div class="single_confirmation_details">
                    <h4>Th??ng tin ????n h??ng</h4>
                    <ul>
                    <li>
                        <p>M?? ????n h??ng</p><span>: ${this.bill._id}</span>
                    </li>
                    <li>
                        <p>Ng??y mua</p><span>: ${this.bill.buyDate}</span>
                    </li>
                    <li>
                        <p>T???ng ti???n</p><span>: USD ${this.bill.priceTotal}</span>
                    </li>
                    <li>
                        <p>Ph????ng th???c thanh to??n</p><span>: ${this.bill.pay}</span>
                    </li>
                    </ul>
                </div>
                </div>
                <div class="col-lg-6 col-lx-4">
                <div class="single_confirmation_details">
                    <h4>?????a ch??? giao h??ng</h4>
                    <ul>
                        <li>
                            <p>Address</p><span>:${this.user.address}</span>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
        `
        
        const headerBillProductHtml = `
        <div class="row">
            <div class="col-lg-12">
            <div class="order_details_iner">
                <h3>Chi ti???t ????n h??ng</h3>
                <table class="table table-borderless">
                <thead>
                    <tr>
                    <th scope="col" colspan="2">S???n ph???m</th>
                    <th scope="col">S??? l?????ng</th>
                    <th scope="col">T???ng gi??</th>
                    </tr>
                </thead>
                <tbody>
        `
        const bodyBillProductHtml = this.billProducts.map(item => {
            return `
                <tr>
                    <th colspan="2"><span>${item.product.name}</span></th>
                    <th>x${item.quantity}</th>
                    <th> <span>${item.quantity * item.unitPrice} vn??</span></th>
                </tr>
            `
        }) 
        
        const foooterBillProductHtml = `
                    <tr>
                        <th colspan="3">m?? gi???m gi??</th>
                        <th> <span>-${couponReduce} vn??</span></th>
                    </tr>
                    <tr>
                        <th colspan="3">T???ng ti???n</th>
                        <th> <span>${this.bill.priceTotal - 25000} vn??</span></th>
                    </tr>
                    <tr>
                        <th colspan="3">Giao h??ng</th>
                        <th><span>25000 vn??</span></th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <th scope="col" colspan="3">Th??nh ti???n</th>
                    <th scope="col">$${this.bill.priceTotal}</th>
                    </tr>
                </tfoot>
                </table>
            </div>
            </div>
        </div>
        `
        container.innerHTML = billHtml + headerBillProductHtml + bodyBillProductHtml.join('') + foooterBillProductHtml;
    },
    getParameterByName: function (name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    start: async function () {
        const idbill = this.getParameterByName('id');

        await this.loadUser()

        await this.loadBill(idbill)

        await this.loadBillProducts(idbill)

        await this.render()

        await this.loadMenuAccount()
    }
}

app.start()
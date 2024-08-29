export class dataStore {
    constructor() {
        this.fullBody = document.querySelector('#app')
    }

    setLocals() {
        const rowsEntries = this.fullBody.querySelectorAll('tbody tr')
        
        let list = []

        rowsEntries.forEach(rowEntry => {

            const entryUsername = rowEntry.querySelector('.NameAndAdr span').textContent
               const entryLogin = rowEntry.querySelector('.NameAndAdr a').textContent
               const entryrepos = rowEntry.querySelector('.secondDim').textContent
             const entryFollows = rowEntry.querySelector('.thirdDim').textContent

            const entryObj = {
                name:entryUsername,
                login:entryLogin,
                repos:entryrepos,
                followers:entryFollows
            }

            list.unshift(entryObj)
        });

        localStorage.setItem('usersLocalBK', JSON.stringify(list))
    }


    loadLocals(userToRemove) {
        const bkDatas = JSON.parse(localStorage.getItem('usersLocalBK'))
        bkDatas.forEach(bkData => {
            if (bkData.login !== userToRemove) {
                this.parseElement(
                    bkData.name, 
                    bkData.repos, 
                    bkData.followers, 
                    bkData.login.replace('/','')
                )
            }
        })
    }

}


export class dataHandler extends dataStore {
    constructor() {
        super()
        this.inputValue()
        this.clearRows()
        this.loadLocals()
        // this.initLoad()
    }


    inputValue() {
        const buttonTag = this.fullBody.querySelector('header button')
        buttonTag.addEventListener('click', () => {
            const inputTagValue = this.fullBody.querySelector('header input').value
            this.getUserData(inputTagValue)
        })
    }


    getUserData(username) {
        const url = `https://api.github.com/users/${username}`
        const resPromise = fetch(url)
                            .then(req => {
                                if(username==="") {
                                    throw new Error("Usuário não informado.");
                                }
                                return req.json()
                            })
                            .then(jsonObj => {
                                const { name, public_repos, followers, login } = jsonObj
                                const rowsLogin = this.fullBody.querySelectorAll('tbody tr a')
                                
                                rowsLogin.forEach(rowLogin => {
                                    const rowLoginText = rowLogin.textContent
                                    if(rowLoginText === '/' + login) {
                                        throw new Error("Usuário já adicionado.");
                                    }
                                })
                                
                                return this.parseElement(name, public_repos, followers, login)
                            })

                            .catch(err => {
                                alert(err)
                                console.log(err)
                            })
        return resPromise
    }


    deleteEntryFeature(entry) {
        const removeBtn = entry.querySelector('.fourthDim button')

        removeBtn.addEventListener('click', () => {
            const removingUser = entry.querySelector('.NameAndAdr a').textContent

            this.clearRows()
            this.loadLocals(removingUser)

        })
    }
    

    clearRows() {
        const rows = this.fullBody.querySelectorAll('tbody tr')
        rows.forEach(row => {
            row.remove()
        });
    }


    parseElement(ghname, ghrepos, ghfollowers, ghlogin) {
        const tableBody = this.fullBody.querySelector('tbody')
        const newRow = document.createElement('tr')
        
        const element = `
        <td class="firstDim">
                        <div class="conteiner">
                            <img src="https://github.com/${ghlogin}.png">
                            <div class="NameAndAdr">
                                <span>${ghname}</span>
                                <a href="https://github.com/${ghlogin}" target="_blank">/${ghlogin}</a>
                            </div>
                        </div>
                    </td>
                    <td class="secondDim">${ghrepos}</td>
                    <td class="thirdDim">${ghfollowers}</td>
                    <td class="fourthDim">
                        <button>Remover</button>
                    </td>`

        newRow.innerHTML = element
        this.deleteEntryFeature(newRow)
        tableBody.prepend(newRow)
        this.setLocals()
    }
    
}




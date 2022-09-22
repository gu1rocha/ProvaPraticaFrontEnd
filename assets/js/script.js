const tbody = document.querySelector('tbody')
const form = document.querySelector('form')

const name_input = document.getElementById('name')
const email_input = document.getElementById('email')
const gender_input = document.getElementById('gender')
const status_input = document.getElementById('status')

let editFormData;

let searchToken = ()=>{
    if(!!sessionStorage.getItem('token')){
        return sessionStorage.getItem('token')
    }else if(!!localStorage.getItem('token')){
        return localStorage.getItem('token')
    }
    return null
}

let messageBoxErroToken = (status, id = null, fnc)=>{
    showMessageBox().showMessage({
        type: 'warning',
        title: 'Token necessário',
        boxInput: {
            textarea: true,
            text:  `Informe seu token para ${status} o usuário!`,
            boxCheck: {
                corpo : `
                        <label for="sessionStorage"> 
                            <input type="radio" name="token" id="sessionStorage" value="sessionStorage">Salvar na seção
                        </label>
                    
                        <label for="localStorage"> 
                            <input type="radio" name="token" id="localStorage" value="localStorage">Manter salvo
                        </label>
                        `
            }
        },
        accept:{
            function: (BoxMessage)=>{ if(BoxMessage.objeto.check === 'localStorage'){
                                            localStorage.setItem('token', BoxMessage.objeto.texto)
                                        }else if(BoxMessage.objeto.check === 'sessionStorage'){
                                            sessionStorage.setItem('token', BoxMessage.objeto.texto)
                                        }
                                        let textToken = BoxMessage.objeto.texto
                                        !!id ? fnc(id, textToken) : fnc(textToken)
                                    },
            text: `${Capitalize(status)}`
        }
    })
}

let token = searchToken()

const url = 'https://gorest.co.in/public/v2/users'

let clearForm = ()=>{
    name_input.value = ''
    email_input.value = ''
    gender_input.value = 'male'
    status_input.value = 'active'
}

let addUserCall = ()=>{
    showMessageBox().showMessage({
        type: 'warning',
        title: 'Salvar Usuário',
        text: `Realmente deseja salvar o usuário: <br/><strong>${name_input.value}</strong>?`,
        accept:{
            function : function(){
                if(!!token){
                    addUser()
                }else{
                    messageBoxErroToken('salvar', false, addUser)
                }
            },
            text: 'Salvar'
        }
    })
}

let addUser = (token)=>{
    Loading(document.querySelector('body')).creat()
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name : name_input.value,
            email: email_input.value,
            gender: gender_input.value,
            status: status_input.value
        })
    })
    .then(res => {
        if(res.status === 401){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Token Inválido',
                text: `Token invalido, por favor tente novamente`,
            })
        }
        return res.json()
    })
    .then(data => {
        const dataArr = []
        dataArr.push(data)
        console.log(dataArr)
        renderRows(dataArr)
        clearForm()
    })
}

let editUserCall = ()=>{
    showMessageBox().showMessage({
        type: 'danger',
        title: 'Editar Usuário',
        text: `Realmente deseja editar o usuário: <br/><strong>${name_input.value}</strong>?`,
        accept:{
            function : function(){
                if(!!token){
                    editUser()
                }else{
                    messageBoxErroToken('editar', false, editUser)
                }
            },
            text: 'Editar'
        }
    })
}

let editUser = (token)=>{
    Loading(document.querySelector('body')).creat()
    fetch(`${url}/${editFormData}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name : name_input.value,
            email: email_input.value,
            gender: gender_input.value,
            status: status_input.value
        })
    })
    .then(res => {
        if(res.status === 401){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Token Inválido',
                text: `Token invalido, por favor tente novamente`,
            })
        }else{
            renderRows()
            clearForm()
            editFormData = undefined
        }
        return res.json()
    })

}

let setDados = (nome, email, genero, stats)=>{
    name_input.value = nome
    email_input.value = email
    gender_input.value = genero
    status_input.value = stats
}

let editRowCall = id =>{
    Loading(document.querySelector('body')).creat()
    fetch(`${url}/${id}`,{
        method: 'GET'
    })
    .then(res => res.json())
    .then(res=> {
        setDados(res.name, res.email, res.gender, res.status)
        Loading(document.querySelector('body')).remove()
        editFormData = id
    })
}

let deleteRow = (id, token) =>{
    fetch(`${url}/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(res => {
        if(res.status === 401){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Token Inválido',
                text: `Token invalido, por favor tente novamente`,
            })
        }else{
            Loading(document.querySelector('body')).creat()
            renderRows()
        }
    })
   .catch((error)=>{
        console.log(error)
   });
}

let deleteRowCall = (id, nome) =>{
    showMessageBox().showMessage({
        type: 'danger',
        title: 'Excluir Usuário',
        text: `Realmente deseja excluir o usuário: <br/><strong>${nome}</strong>?`,
        accept:{
            function : function(){
                if(!!token){
                    deleteRow(id,token)
                }else{
                    messageBoxErroToken('excluir', id, deleteRow)
                }
            },
            text: 'Excluir'
        }
    })
}

let renderRows = (valor = null)=>{
    if(!!valor){
        valor.forEach(post => {
            const tr = document.createElement('tr')
            tr.dataset.item = JSON.stringify(post)
            tr.innerHTML = `
                    <tr>
                        <td>${post.id}</td>
                        <td>${post.name}</td>
                        <td>${post.email}</td>
                        <td><button class="edit">Editar</button><button class="delet">Excluir</button></td>
                    </tr>
                    `
                    
            tbody.appendChild(tr);
            tr.querySelector('.edit').addEventListener('click',(e)=>{editRowCall(post.id)})
            tr.querySelector('.delet').addEventListener('click',(e)=>{deleteRowCall(post.id, post.name)})
        });
        Loading(document.querySelector('body')).remove()
    }else{
        fetch(url)
        .then(res => res.json())
        .then(data => { 
            tbody.innerHTML = ''
            data.forEach(post => {
                const tr = document.createElement('tr')
                tr.dataset.item = JSON.stringify(post)
                tr.innerHTML = `
                        <tr>
                            <td>${post.id}</td>
                            <td>${post.name}</td>
                            <td>${post.email}</td>
                            <td><button class="edit">Editar</button><button class="delet">Excluir</button></td>
                        </tr>
                        `
                        
                tbody.appendChild(tr);
                tr.querySelector('.edit').addEventListener('click',(e)=>{editRowCall(post.id)})
                tr.querySelector('.delet').addEventListener('click',(e)=>{deleteRowCall(post.id, post.name)})
            });
            Loading(document.querySelector('body')).remove()
        })
    }
}

Loading(document.querySelector('body')).creat()
renderRows()


form.addEventListener('submit',(e)=>{
    e.preventDefault()
    !!editFormData ? editUserCall() : addUserCall()
})
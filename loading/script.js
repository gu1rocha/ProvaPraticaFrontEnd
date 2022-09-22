let Loading = (obj) =>{
    let load = {
        creat : function(){
            let card = document.createElement('div');
            card.classList.add('bgLoad')
            let load = `
                            <div class="lds-roller">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        `
            card.innerHTML = load;
            obj.appendChild(card);
        },
        remove : function(){
            obj.querySelector('.bgLoad').remove()
        }
    }
    return load
}
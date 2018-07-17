function generateUUID() {
    /*jshint bitwise:false */
    var i,
        random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12
            ? 4
            : (i === 16
                ? (random & 3 | 8)
                : random)).toString(16);
    }
    return uuid;
}

const data = {
    allListItems: [
        {id: 'c57aab79-7dfa-4d85-8ede-aa653a8b5d93', title: "Parking Lot APP Refactor", isChecked: false},
        {id: '00bd6227-e881-4024-ad7a-4212d930c947', title: "Parking Lot APP 时序图", isChecked: true},
        {id: '8a134a9d-1df9-475a-ba5c-e27f9f003a99', title: "Parking Lot APP 中类的流程图", isChecked: false},
        {id: 'af51c0e0-97a4-4e78-9a31-48763fd6c089', title: "总结Java和面向对象相关的概念和知识", isChecked: true},
        {id: 'cda424c4-7f16-4841-886a-0de60a395d34', title: "总结Parking Lot APP开发过程中的问题和经验", isChecked: false},
        {id: '4a44c65d-a933-402f-b2ee-f8c2dcafee79', title: "总结TDD和Mock的应用经验", isChecked: false}],
    footerItems: [{title: 'ALL', selected: true}, {title: 'Active', selected: false}, {
        title: 'Complete',
        selected: false
    }]
};

$(document)
    .ready(function () {
        renderListItems(data.allListItems, $("ol"));
        addListenerForFooter();
    });


//渲染列表
function renderListItems(datas, parentElem, wantToDisplay) {
    if (wantToDisplay === undefined)
        wantToDisplay = (item) => true;
    parentElem.empty();
    for (let item of datas) {
        if (!wantToDisplay(item))
            continue;
        let html = `<li id=${item.id} class${item.isChecked ? '="checked"' : ''}>
                        <input name="done-todo" type="checkbox" class="done-todo" onclick="handleCheckBoxClicked('${item.id}')" ${item.isChecked ? 'checked' : ''}> ${item.title}</li>`;
        parentElem.append(html);
    }
    // addListenerForItems();
}

// //监听列表项点击事件
// function addListenerForItems() {
//     let ol = $("ol");
//     ol.find("li").click(function () {
//         let currentLi = $(this);
//         let id = currentLi.attr('id');
//         let elem = data.allListItems.find(currentVal => currentVal.id === id);
//         elem.isChecked = !elem.isChecked;
//         renderListItems(data.allListItems, $("ol"));
//     });
// }

function renderFooter(datas, parentElem) {
    parentElem.empty();
    for (let item of datas) {
        let html = `<li><a href="#" data-filter="all" class${item.selected ? '=selected' : ''}>${item.title}</a></li>`;
        parentElem.append(html);
    }
    addListenerForFooter();
}

//监听下方三个按钮的点击事件
function addListenerForFooter() {
    $("#filters").find("li").click(function () {
        let title = $(this).text().trim();
        data.footerItems.map(currentVal => {
            if (currentVal.title === title)
                currentVal.selected = true;
            else
                currentVal.selected = false;
        });
        renderFooter(data.footerItems, $("#filters"));
        let whetherDisplay;
        switch (title) {
            case 'ALL':
                whetherDisplay = item => true;
                break;
            case 'Active':
                whetherDisplay = item => !item.isChecked;
                break;
            case 'Complete':
                whetherDisplay = item => item.isChecked;
                break;
        }
        renderListItems(data.allListItems, $("ol"), whetherDisplay);
    });
}

/**
 * ***********************************************************************************************************
 * @param id
 */
//处理单选框点击事件
function handleCheckBoxClicked(id){
    let targetItem = data.allListItems.find(item => item.id === id);
    targetItem.isChecked = !targetItem.isChecked;
    renderListItems(data.allListItems, $("ol"));
}

//处理添加按钮点击事件
function handleAddButtonClicked(){
    let input = $("input[name='ListItem']").val();
    data.allListItems.push({title: input, id: generateUUID(), isChecked: false});
    let ol = $("ol");
    renderListItems(data.allListItems, ol);
    $("input[name='ListItem']").val('');
}


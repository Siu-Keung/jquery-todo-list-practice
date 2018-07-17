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
    allListItems: [],
    footerItems: [{title: 'ALL', selected: true}, {title: 'Active', selected: false}, {
        title: 'Complete',
        selected: false
    }]
};

$(document)
    .ready(function () {
        render(data, $("div[class='container']"));


    });

//处理单选框点击事件
function handleCheckBoxClicked(id){
    let targetItem = data.allListItems.find(item => item.id === id);
    targetItem.isChecked = !targetItem.isChecked;
    render(data, $("div[class='container']"));
}

//处理添加按钮点击事件
function handleAddButtonClicked(){
    let input = $("input[name='ListItem']").val();
    data.allListItems.push({title: input, id: generateUUID(), isChecked: false});
    let ol = $("ol");
    render(data, $("div[class='container']"));
    $("input[name='ListItem']").val('');
}

//处理过滤按钮点击事件
function handleFilterButtonClicked(title){
    let oralVal = data.footerItems.find(item => item.selected === true);
    oralVal.selected = false;
    let filterModel = data.footerItems.find(item => item.title === title);
    filterModel.selected = true;
    render(data, $("div[class='container']"));
}

function handleItemOnBlur(id){
    let itemElem = $("#" + id);
    let newTitle = itemElem.text().trim();
    data.allListItems.find(item => item.id === id).title = newTitle;
    render(data, $("div[class='container']"));
}

function handleListItemClicked(id){
    let listItem = $("#" + id);
    listItem.attr("contenteditable", "true");
}


function generateListItem(item){
    return `<li id=${item.id} class${item.isChecked ? '="checked"' : ''} onblur="handleItemOnBlur('${item.id}')" onclick="handleListItemClicked('${item.id}')">
                <input name="done-todo" type="checkbox" class="done-todo" 
                 onclick="handleCheckBoxClicked('${item.id}')" ${item.isChecked ? 'checked' : ''}> ${item.title}</li>`;
}

function generateFooterButton(item){
    return ` <li>
                    <a href="javascript:handleFilterButtonClicked('${item.title}')" data-filter="" class="${item.selected ? 'selected' : ''}">${item.title}</a>
                </li>`;
}

function render(data, parentElem){
    parentElem.empty();
    let items;
    let selectedFooterItem = data.footerItems.find(item => item.selected);
    switch (selectedFooterItem.title){
        case 'ALL':
            items = data.allListItems;
            break;
        case 'Active':
            items = data.allListItems.filter(item => item.isChecked === false);
            break;
        case 'Complete':
            items = data.allListItems.filter(item => item.isChecked === true);
            break;
    } ;
    let html = `
        <div>
            <h2>Jquery To Do List</h2>
            <p>
                <em>Simple Todo List with adding and filter by diff status.</em>
            </p>
        </div>
        <div>
            <input class="input-text" type="text" name="ListItem" data-com.agilebits.onepassword.user-edited="yes">
            <div id="button" onclick="handleAddButtonClicked()">Add</div>
        </div>
        <br>
        <ol>
                ${items.map(item => generateListItem(item)).join('\n')}
        </ol>
        <div>
            <ul id="filters">
            ${data.footerItems.map(item => generateFooterButton(item)).join("\n")}
            </ul>

        </div>`;
    parentElem.append(html);
}

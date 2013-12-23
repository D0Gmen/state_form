state_form
==========

watch for form element state


EXAMPLE:
==========

simple: 

```javascript
$(document).ready(function() {
	var name = $('form').attr('name');
	$('[data-id="rbc_main_form"]').state_form();
});
```

with parametrs:

```javascript
$(document).ready(function() {
	$('form').state_form({
		//name input in form
		inputName: 'changed_state',  //is default
		//add input with changes in form
		insertInForm: 1, //is defaul
		//function before form submit
		//call if form has changes
		ifChanged: function() { //is default
			return true;
		}
	});
});
```

PUBLIC METHODS:
==========

```javascript
//return true or false;
$('form').state_form('is_changed');

//return array with changes
$('form').state_form('get_changes');
```
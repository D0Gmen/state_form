/*!
 * jQuery state_form v0.0.1
 * https://github.com/Slavenin/state_form
 *
 * Copyright 2013 Barulin Maxim
 * Released under the GPU license
 */
(function($) {
	var methods = {
		/**
		 *initialization
		 * @param {Object} options
		 * @returns {jQuery}
		 */
		init: function(options) {
			var settings = $.extend({
				insertInForm: 1,
				inputName: 'changed_state',
				exclude: [],
				ifChanged: function() {
					return true;
				}
			}, options);

			this.state_form('init_state', settings);

			return this;
		},
		/**
		 * initialization first states
		 * @param {Object} settings
		 */
		init_state: function(settings) {
			this.each(function() {
				var $this = $(this);
				$this.submit($this.state_form('onSubmit', settings));
				$this.data({
					settings: settings
				});

				$('input,select,textarea', $this).not('[type="button"],[type="submit"]').each(function() {
					var $$this = $(this);
					
					var tmp = {
						state: {
							element_name: null,
							first_val: null,
							raw_text_first: null,
							curent_val: null,
							raw_text_last: null
						}
					};

					switch(this.tagName)
					{
						case 'INPUT':
							if(this.type == 'checkbox' || this.type == 'radio')
							{
								if($$this.is(':checked') && void 0 !== $$this.attr('value'))
								{
									tmp.state.first_val = $$this.val();
								}
								else
								{
									tmp.state.first_val = $$this.is(':checked');
								}
							}
							else if (void 0 === $$this.attr('value'))
							{
								window.console.debug('Внимание: у элемента нет атрибута value! (WARNING: element has no attr value!)');
								window.console.debug(this);
							}
							else
							{
								tmp.state.first_val = $$this.val();
							}

							break;
						case 'TEXTAREA':
							tmp.state.first_val = $$this.val();
							break;
						case 'SELECT':
							tmp.state.first_val = $$this.val();
							tmp.state.raw_text_first = $$this.find('option:selected').text();
							break;
					}
					$$this.change($$this.state_form('change_state'));

					if($$this.prop('name'))
					{
						tmp.state.element_name = this.name;
					}
					else if($$this.prop('id'))
					{
						tmp.state.element_name = this.id;
					}
					else
					{
						window.console.debug('Внимание: у элемента нет имени! (WARNING: element has no name!)');
						window.console.debug(this);
					}

					$$this.data(tmp);
				});

			});
		},
		/**
		 * call on form submit
		 * @param {Object} settings
		 * @returns {Function}
		 */
		onSubmit: function(settings) {
			return function() {
				var $this = $(this);
				if($this.state_form('is_changed'))
				{
					if(settings.insertInForm)
					{
						var input = $('<input type="hidden" name="' + settings.inputName + '">');
						$this.append(input);
						input.val(JSON.stringify($this.state_form('get_changes')));
					}
					else
					{
						$('input[name="changed_state"]', $this).remove();
					}

					return settings.ifChanged.call($this);
				}

				return true;
			};
		},
		/**
		 * check changes
		 * @returns {Boolean}
		 */
		is_changed: function() {
			return (this.state_form('get_changes').length ? true : false);
		},
		/**
		 * returns changes array
		 * @returns {Array}
		 */
		get_changes: function() {
			var changes = [];
			var opt = this.data().settings;
			$('[data-state-is_changed]', this).each(function() {
				var d = $(this).data();
				if($.inArray(d.element_name, opt.exclude) === -1)
				{
					changes.push(d.state);
				}
			});

			//отдельно обрабатываем скрытые поля
			//так как change у них не произойдёт
			$('input[type="hidden"]', this).each(function() {
				var $this = $(this);
				var d = $this.data();
				if(typeof d === 'object' && d.hasOwnProperty('state'))
				{
					var data = d.state;
					if($.inArray(data.element_name, opt.exclude) === -1)
					{
						if(data.first_val != $this.val())
						{
							changes.push(data);
						}
					}
				}
			});

			return changes;
		},
		/**
		 * call on event change control
		 * @returns {Function}
		 */
		change_state: function() {
			return function() {
				var $this = $(this);
				var data = $this.data();
				var val = $this.val();

				if(this.type == 'checkbox' || this.type == 'radio')
				{
					if($this.is(':checked') && void 0 !== $this.attr('value'))
					{
						data.state.curent_val = val;
					}
					else
					{
						data.state.curent_val = val =  $this.is(':checked');
					}
				}
				else
				{
					data.state.curent_val = val;
					if(this.tagName == 'SELECT')
					{
						data.state.raw_text_last = $this.find('option:selected').text();
					}
				}

				if(val != data.state.first_val)
				{
					$this.attr('data-state-is_changed', '1');
				}
				else
				{
					$this.removeAttr('data-state-is_changed');
				}
			};
		}
	};

	$.fn.state_form = function(method) {

		if (methods[method])
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method)
		{
			return methods.init.apply(this, arguments);
		}
		else
		{
			$.error('Метод с именем ' + method + ' не существует для jQuery');
		}

	};
})(jQuery);
/*! 
 * Nova Creator Bootstrap Tree v1.0.0 - 11/04/2016
 * Copyright (c) 2015-2016 Nova Creator Software (https://github.com/NovaCreatorSoftware/bootstrap-tree)
 * Licensed under MIT http://www.opensource.org/licenses/MIT
 */
;(function ($, window, undefined)
{
    /*jshint validthis: true */
    "use strict";

(function ($) {
$.fn.treely = function (options) {
	var defaults = {
		selectable: true,
		deletable: false,
		editable: false,
		addable: false,
		i18n: {
			deleteNull: 'Delete null',
			deleteConfirmation: 'Are you sure you want to delete?',
			confirmButtonLabel: 'Confirm',
			editNull: 'Edit null',
			editMultiple: 'Edit multiple',
			addMultiple: 'Add multiple',
			collapseTip: 'Collapse tip',
			expandTip: 'Expand tip',
			selectTip: 'Select tip',
			unselectTip: 'Unselect tip',
			editTip: 'Edit tip',
			addTip: 'Add tip',
			deleteTip: 'Delete tip',
			cancelButtonLabel: 'Cancel button'
		}
	};

	var warningAlert = $('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong></strong><span class="alert-content"></span> </div> ');
	var dangerAlert = $('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong></strong><span class="alert-content"></span> </div> ');

	var createInput = $('<div class="input-group"><input type="text" class="form-control"><span class="input-group-btn"><button type="button" class="btn btn-default btn-success confirm"></button> </span><span class="input-group-btn"><button type="button" class="btn btn-default cancel"></button> </span> </div> ');

	options = $.extend(defaults, options);

	this.each(function () {
		var treely = $(this);

		var getSelectedItems = function () {
			return $(treely).find('li.li_selected');
		};

		$.each($(treely).find('ul > li'), function() {
			var text;
			if($(this).is('li:has(ul)')) {
				var children = $(this).find(' > ul');
				$(children).remove();
				text = $(this).text();
				$(this).html('<span><span class="glyphicon"></span><a href="javascript: void(0);"></a> </span>');
				$(this).find(' > span > span').addClass('glyphicon-folder-open');
				$(this).find(' > span > a').text(text);
				$(this).append(children);
			} else {
				text = $(this).text();
				$(this).html('<span><span class="glyphicon"></span><a href="javascript: void(0);"></a> </span>');
				$(this).find(' > span > span').addClass('glyphicon-file');
				$(this).find(' > span > a').text(text);
			}
		});

		$(treely).find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', options.i18n.collapseTip);

		if(options.deletable || options.editable || options.addable) {
			$(treely).prepend('<div class="treely-toolbar"></div> ');
		}

		if(options.addable) {
			$(treely).find('.treely-toolbar').append('<div class="create"><button class="btn btn-default btn-sm btn-success"><span class="glyphicon glyphicon-plus"></span></button></div> ');
			$(treely).find('.treely-toolbar .create > button').attr('title', options.i18n.addTip).click(function () {
				var createBlock = $(treely).find('.treely-toolbar .create');
				$(createBlock).append(createInput);
				$(createInput).find('input').focus();
				$(createInput).find('.confirm').text(options.i18n.confirmButtonLabel);
				$(createInput).find('.confirm').click(function () {
					if($(createInput).find('input').val() === '') {
						return;
					}
					var selected = getSelectedItems();
					var item = $('<li><span><span class="glyphicon glyphicon-file"></span><a href="javascript: void(0);">' + $(createInput).find('input').val() + '</a> </span></li>');
					$(item).find(' > span > span').attr('title', options.i18n.collapseTip);
					$(item).find(' > span > a').attr('title', options.i18n.selectTip);
					if(selected.length <= 0) {
						$(treely).find(' > ul').append($(item));
					} else if(selected.length > 1) {
						$(treely).prepend(warningAlert);
						$(treely).find('.alert .alert-content').text(options.i18n.addMultiple);
					} else {
						if($(selected).hasClass('parent_li')) {
							$(selected).find(' > ul').append(item);
						} else {
							$(selected).addClass('parent_li').find(' > span > span').addClass('glyphicon-folder-open').removeClass('glyphicon-file');
							$(selected).append($('<ul></ul>')).find(' > ul').append(item);
						}
					}
					$(createInput).find('input').val('');
					if(options.selectable) {
						$(item).find(' > span > a').attr('title', options.i18n.selectTip);
						$(item).find(' > span > a').click(function (e) {
							var li = $(this).parent().parent();
							if(li.hasClass('li_selected')) {
								$(this).attr('title', options.i18n.selectTip);
								$(li).removeClass('li_selected');
							} else {
								$(treely).find('li.li_selected').removeClass('li_selected');
								$(this).attr('title', options.i18n.unselectTip);
								$(li).addClass('li_selected');
							}

							if(options.deletable || options.editable || options.addable) {
								var selected = getSelectedItems();
								if(options.editable) {
									if(selected.length <= 0 || selected.length > 1) {
										$(treely).find('.treely-toolbar .edit > button').addClass('disabled');
									} else {
										$(treely).find('.treely-toolbar .edit > button').removeClass('disabled');
									}
								}

								if(options.deletable) {
									if(selected.length <= 0 || selected.length > 1) {
										$(treely).find('.treely-toolbar .remove > button').addClass('disabled');
									} else {
										$(treely).find('.treely-toolbar .remove > button').removeClass('disabled');
									}
								}
							}

							e.stopPropagation();

						});
					}
					$(createInput).remove();
				});
				$(createInput).find('.cancel').text(options.i18n.cancelButtonLabel);
				$(createInput).find('.cancel').click(function () {
					$(createInput).remove();
				});
			});
		}

		if(options.editable) {
			$(treely).find('.treely-toolbar').append('<div class="edit"><button class="btn btn-default btn-sm btn-primary disabled"><span class="glyphicon glyphicon-edit"></span></button></div> ');
			$(treely).find('.treely-toolbar .edit > button').attr('title', options.i18n.editTip).click(function () {
				$(treely).find('input.treely-editor').remove();
				$(treely).find('li > span > a:hidden').show();
				var selected = getSelectedItems();
				if(selected.length <= 0) {
					$(treely).prepend(warningAlert);
					$(treely).find('.alert .alert-content').html(options.i18n.editNull);
				} else if (selected.length > 1) {
					$(treely).prepend(warningAlert);
					$(treely).find('.alert .alert-content').html(options.i18n.editMultiple);
				} else {
					var value = $(selected).find(' > span > a').text();
					$(selected).find(' > span > a').hide();
					$(selected).find(' > span').append('<input type="text" class="treely-editor">');
					var editor = $(selected).find(' > span > input.treely-editor');
					$(editor).val(value);
					$(editor).focus();
					$(editor).keydown(function (e) {
						if(e.which === 13) {
							if($(editor).val() !== '') {
								$(selected).find(' > span > a').text($(editor).val());
								$(editor).remove();
								$(selected).find(' > span > a').show();
							}
						}
					});
				}
			});
		}

		if(options.deletable) {
			$(treely).find('.treely-toolbar').append('<div class="remove"><button class="btn btn-default btn-sm btn-danger disabled"><span class="glyphicon glyphicon-remove"></span></button></div> ');
			$(treely).find('.treely-toolbar .remove > button').attr('title', options.i18n.deleteTip).click(function () {
				var selected = getSelectedItems();
				if(selected.length <= 0) {
					$(treely).prepend(warningAlert);
					$(treely).find('.alert .alert-content').html(options.i18n.deleteNull);
				} else {
					$(treely).prepend(dangerAlert);
					$(treely).find('.alert .alert-content').html(options.i18n.deleteConfirmation)
						.append('<a style="margin-left: 10px;" class="btn btn-default btn-danger confirm"></a>')
						.find('.confirm').html(options.i18n.confirmButtonLabel);
					$(treely).find('.alert .alert-content .confirm').on('click', function () {
						$(selected).find(' ul ').remove();
						if($(selected).parent('ul').find(' > li').length <= 1) {
							$(selected).parents('li').removeClass('parent_li').find(' > span > span').removeClass('glyphicon-folder-open').addClass('glyphicon-file');
							$(selected).parent('ul').remove();
						}
						$(selected).remove();
						$(dangerAlert).remove();
					});
				}
			});
		}

		// collapse or expand
		$(treely).delegate('li.parent_li > span', 'click', function (e) {
			var children = $(this).parent('li.parent_li').find(' > ul > li');
			if(children.is(':visible')) {
				children.hide('fast');
				$(this).attr('title', options.i18n.expandTip)
					.find(' > span.glyphicon')
					.addClass('glyphicon-folder-close')
					.removeClass('glyphicon-folder-open');
			} else {
				children.show('fast');
				$(this).attr('title', options.i18n.collapseTip)
					.find(' > span.glyphicon')
					.addClass('glyphicon-folder-open')
					.removeClass('glyphicon-folder-close');
			}
			e.stopPropagation();
		});

		if(options.selectable) {
			$(treely).find('li > span > a').attr('title', options.i18n.selectTip);
			$(treely).find('li > span > a').click(function (e) {
				var li = $(this).parent().parent();
				if(li.hasClass('li_selected')) {
					$(this).attr('title', options.i18n.selectTip);
					$(li).removeClass('li_selected');
				} else {
					$(treely).find('li.li_selected').removeClass('li_selected');
					$(this).attr('title', options.i18n.unselectTip);
					$(li).addClass('li_selected');
				}

				if(options.deletable || options.editable || options.addable) {
					var selected = getSelectedItems();
					if(options.editable) {
						if(selected.length <= 0 || selected.length > 1) {
							$(treely).find('.treely-toolbar .edit > button').addClass('disabled');
						} else {
								$(treely).find('.treely-toolbar .edit > button').removeClass('disabled');
						}
					}

					if(options.deletable) {
						if(selected.length <= 0 || selected.length > 1) {
							$(treely).find('.treely-toolbar .remove > button').addClass('disabled');
						} else {
							$(treely).find('.treely-toolbar .remove > button').removeClass('disabled');
						}
					}
				}

				e.stopPropagation();
			});
		}
	});
};
})(jQuery);
})(jQuery, window);
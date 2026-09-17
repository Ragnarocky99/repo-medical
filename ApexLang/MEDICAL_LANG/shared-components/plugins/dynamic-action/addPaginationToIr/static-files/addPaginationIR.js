var IRPagination = {};
IRPagination.totalRowsLabel = '';
IRPagination.firstPageTitle = '';
IRPagination.lastPageTitle = '';
IRPagination.func = {
    addPaginationIR: function () {
        $('.a-IRR-container').each(function () {
			if($(this).closest('[fao-pagination=none]').length>0)
				return true;
			//---
			var pageStr = $(this).find('.a-IRR-pagination-label').eq(0).text().replace(/\./g, '');
			var pageAttrs = new RegExp(/(\d+) -(\s+)(\d+) ([^\d]+)(\s+)(\d+)/gi).exec($.trim(pageStr.replace(/,/gi,'')))
			if(!pageAttrs)
				return;
			//---------
			var pIR_id = $(this).attr('id').substr(0, $(this).attr('id').length-3);
			var perPage = parseInt($('#' + pIR_id +'_row_select').val());
			var start= parseInt(pageAttrs[1]);
			var end = parseInt(pageAttrs[3]);
			var total = parseInt(pageAttrs[6]);
            var $pgSelect = $('<select class="a-IRR-pagination-select fao-pagination-item">')

            var minRow;
            var i = 0;
            for (i = 0; i < (total / perPage) - 1; i++) {
                minRow = (i * perPage) + 1;
                $pgSelect.append('<option value="' + minRow + '" ' + (minRow == start ? 'selected' : '') + '>' + (i + 1) + ' (' + IRPagination.func.toSeparatedPageNumber(minRow) + ' - ' + IRPagination.func.toSeparatedPageNumber((i * perPage) + perPage) + ')</option>');
            }
            if ((total % perPage) > 0) {
                minRow = (i * perPage) + 1;
                $pgSelect.append('<option value="' + minRow + '" ' + (minRow == start ? 'selected' : '') + '>' + (i + 1) + ' (' + IRPagination.func.toSeparatedPageNumber(minRow) + ' - ' + IRPagination.func.toSeparatedPageNumber(total) + ')</option>');
            }

            $(this).find('.fao-pagination-item').remove();

            $(this).find('.a-IRR-pagination-label').hide().after($pgSelect);
            $(this).find('.a-IRR-pagination-label').after('<button style="display:none;" class="a-IRR-button--pagination fao-pagination-item" data-pagination="" aria-controls="' + pIR_id + '" type="button">@</button>');

            var $pgContainer = $(this).find('.a-IRR-pagination');
            if (start > 1)
                $pgContainer.prepend('<li class="a-IRR-pagination-item fao-pagination-item"><button class="a-Button a-IRR-button a-IRR-button--pagination" data-pagination="pgR_min_row=1max_rows=' + perPage + 'rows_fetched=' + perPage + '" aria-label="First" title="' + IRPagination.firstPageTitle + '" aria-controls="' + pIR_id + '" type="button"><span class="a-Icon icon-left-arrow" aria-hidden="true"></span></button></li>');
            $pgContainer.prepend('<li class="a-IRR-pagination-item fao-pagination-item"><span class="a-IRR-pagination-info">' + IRPagination.totalRowsLabel + ' ' + total + '</span></li>')
            if (start < minRow)
                $pgContainer.append('<li class="a-IRR-pagination-item fao-pagination-item"><button class="a-Button a-IRR-button a-IRR-button--pagination" data-pagination="pgR_min_row=' + minRow + 'max_rows=' + perPage + 'rows_fetched=' + perPage + '" aria-label="Last" title="' + IRPagination.lastPageTitle + '" aria-controls="' + pIR_id + '" type="button"><span class="a-Icon icon-right-arrow" aria-hidden="true"></span></button></li>');
        });
        $('.a-IRR-pagination-select').change(function (obj) {
            var pIR_id = $(this).closest('.a-IRR-container').attr('id');
            pIR_id = pIR_id.substr(0, pIR_id.length - 3);
            var perPage = $('#' + pIR_id + '_row_select').val();
            $(this).prev().attr('data-pagination', 'pgR_min_row=' + $(this).val() + 'max_rows=' + perPage + 'rows_fetched=' + perPage).click();
        })

    },

    toSeparatedPageNumber: function (nStr) {
        nStr += '';
        var comma = /,/g;
        var isNeg = nStr.startsWith('-');
        nStr = nStr
            .replace(comma, '')
            .replace(/[^0-9,.]+/g, "");
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return (isNeg ? '-' : '') + x1 + x2;
    }
};





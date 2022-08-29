define('VALMET/DataTableUx', [
  'jquery',
  'bootstrap',
  'datatables',
], function ($, bootstrap, DataTable) {
  var DemoWidget = {
    onLoad: function () {
      console.log('Call hoise');
      WidgetUwaUtils.setupEnoviaServer();
      window.isIFWE = true;
      window.enoviaServer.showSpace = 'true';
      WidgetUwaUtils.onAfterLoad = Jquery.noop;
      window.enoviaServer.widgetId = widget.id;
      window.WAFData = WAFData;
      DemoWidget.init();
    },

    onRefresh: function () {
      DemoWidget.init();
    },

    init: function () {
      DemoWidget.getWidgetBase();
      DemoWidget.dataTableInit();
    },
    getWidgetBase: function () {
      var widgetContentContainer = {
        tag: 'div',
        class: 'maindiv',
        html: [
          {
            tag: 'div',
            class: 'header',
            html: [
              {
                tag: 'h1',
                class: 'title',
                html: 'DataTableUx',
              },
            ],
          },
          {
            tag: 'table',
            id: 'company_table',
            class: 'table table-striped table-hover table-responsive',
            html: [
              {
                tag: 'thead',
                html: [
                  {
                    tag: 'tr',
                    html: [
                      {
                        tag: 'th',
                        html: 'ID',
                      },
                      {
                        tag: 'th',
                        html: 'Company Name',
                      },
                      {
                        tag: 'th',
                        html: 'Website',
                      },
                      {
                        tag: 'th',
                        html: 'Email',
                      },
                      {
                        tag: 'th',
                        html: 'Yearly Revenue',
                      },
                      {
                        tag: 'th',
                        html: 'Business Type',
                      },
                      {
                        tag: 'th',
                        html: 'District',
                      },
                      {
                        tag: 'th',
                        html: 'Thana',
                      },
                      {
                        tag: 'th',
                        html: 'Actions',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      widget.setBody([widgetContentContainer]);
      widget.body.setStyle('overflow', 'auto');
    },
    dataTableInit: function () {
      jQuery.noConflict();
      jQuery(document).ready(function () {
        jQuery.ajax({
          url: './company.txt',
          // type: 'GET',
          // headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json',
          // },
          success: function (data) {
            jQuery('#company_table').DataTable({
              stateSave: true,
              stateDuration: -1,
              stateSaveCallback: function (settings, data) {
                sessionStorage.setItem(
                  'DataTables_' + settings.sInstance,
                  JSON.stringify(data)
                );
              },
              stateLoadCallback: function (settings) {
                return JSON.parse(
                  sessionStorage.getItem(
                    'DataTables_' + settings.sInstance
                  )
                );
              },
              ajax: './company.txt',
              columnDefs: [
                {
                  defaultContent: '-',
                  targets: '_all',
                },
                {
                  targets: [0],
                  visible: true,
                  searchable: false,
                },
              ],
              columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'website' },
                {
                  data: 'email',
                },
                {
                  data: 'revenue',
                  className: 'dt-right',
                  render: function (data, type) {
                    let number = jQuery.fn.dataTable.render
                      .number(',', '.', 0, '$')
                      .display(data);

                    if (type === 'display') {
                      let color = 'green';
                      if (data <= 250000) {
                        color = '#FF6961';
                      } else if (data <= 1000000) {
                        color = 'orange';
                      } else if (data <= 5000000) {
                        color = '#70AD73';
                      }

                      return (
                        '<span style="color:' +
                        color +
                        '">' +
                        number +
                        '</span>'
                      );
                    }

                    return number;
                  },
                },
                {
                  data: 'type',
                  className: 'dt-center cell-type',
                  render: function (data, type, row) {
                    if (type == 'display') {
                      let str = data.toString();
                      return `<span data-toggle="tooltip" data-placement="top" title="${str}">
                                                            ${
                                                              str.length <
                                                              15
                                                                ? str
                                                                : str.substr(
                                                                    0,
                                                                    15 -
                                                                      1
                                                                  ) +
                                                                  '&#8230;'
                                                            }
                                                            </span>`;
                    }
                    return data;
                  },
                },
                {
                  data: 'district',
                },
                {
                  data: 'thana',
                },
                {
                  data: null,
                  className: 'dt-center',
                  defaultContent: `<div class="btn-grp">
                                                    <button type="button" class="btn btn-outline-primary" data-toggle="tooltip" data-placement="bottom" title="Edit this row" id="edit_button">Edit</button>
                                                    <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="bottom" title="Delete this row" style={padding-left: '16px'} id="delete_button">Delete</button>
                                                    </div>`,
                },
              ],
            });
          },
          error: function (err) {
            console.log(err);
            jQuery('#company_table').DataTable({});
          },
        });
      });
    },
  };
  return DemoWidget;
});

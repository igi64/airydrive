"use strict";
/**
 * @class elFinder command "share".
 * Display dialog with file properties.
 *
 * @author Dmitry (dio) Levashov, dio@std42.ru
 **/
elFinder.prototype.commands.share = function() {
  var m   = 'msg',
    fm  = this.fm,
    spclass = 'elfinder-share-spinner',
    msg = {
      calc     : fm.i18n('calc'),
      size     : fm.i18n('size'),
      unknown  : fm.i18n('unknown'),
      path     : fm.i18n('path'),
      aliasfor : fm.i18n('aliasfor'),
      modify   : fm.i18n('modify'),
      perms    : fm.i18n('perms'),
      locked   : fm.i18n('locked'),
      dim      : fm.i18n('dim'),
      kind     : fm.i18n('kind'),
      files    : fm.i18n('files'),
      folders  : fm.i18n('folders'),
      items    : fm.i18n('items'),
      yes      : fm.i18n('yes'),
      no       : fm.i18n('no'),
      link     : fm.i18n('link')
    };

  var shareToContent =
    '<div id="wrapper" style="min-height:200px">' +
      '<p></p>' +
      '<div class="control-group">' +
      '<label for="select-to">Shared to:</label>' +
      '<select id="select-to" class="contacts" placeholder="Pick some people..."></select>' +
      '</div>' +
      '<p></p>' +
      '</div>';

  this.tpl = {
    main       : '<div class="ui-helper-clearfix elfinder-share-title"><span class="elfinder-cwd-icon {class} ui-corner-all"/>{title}</div>' + shareToContent + '<table class="elfinder-share-tb">{content}</table>',
    itemTitle  : '<strong>{name}</strong><span class="elfinder-share-kind">{kind}</span>',
    groupTitle : '<strong>{items}: {num}</strong>',
    row        : '<tr><td>{label} : </td><td>{value}</td></tr>',
    spinner    : '<span>{text}</span> <span class="'+spclass+'"/>'
  }

  this.alwaysEnabled = true;
  this.updateOnSelect = false;
  this.shortcuts = [{
    pattern     : 'ctrl+shift+s'
  }];

  this.init = function() {
    $.each(msg, function(k, v) {
      msg[k] = fm.i18n(v);
    });
  }

  this.getstate = function() {
    return 0;
  }

  this.exec = function(hashes) {
    var files   = this.files(hashes);
    if (! files.length) {
      files   = this.files([ this.fm.cwd().hash ]);
    }
    var self    = this,
      fm      = this.fm,
      o       = this.options,
      tpl     = this.tpl,
      row     = tpl.row,
      cnt     = files.length,
      content = [],
      view    = tpl.main,
      l       = '{label}',
      v       = '{value}',
      save = function() {
        alert("Saved!");
      },
      cancel = function() {
        $(this).elfinderdialog('close');
      },
      opts    = {
        title : this.title,
        resizable : false,
        modal : true,
        width : 'auto',
        max_width : '670px',
        maxWidth : '670',
        //min_height : '170px',
        //minHeight : '170',
        buttons : {},
        close : function() { $(this).elfinderdialog('destroy'); }
      },
      count = [],
      replSpinner = function(msg) { dialog.find('.'+spclass).parent().text(msg); },
      id = fm.namespace+'-share-'+$.map(files, function(f) { return f.hash }).join('-'),
      dialog = fm.getUI().find('#'+id),
      size, tmb, file, title, dcnt;

    if (!cnt) {
      return $.Deferred().reject();
    }

    if (dialog.length) {
      dialog.elfinderdialog('toTop');
      return $.Deferred().resolve();
    }

    var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
      '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

    var formatName = function(item) {
      return $.trim((item.first_name || '') + ' ' + (item.last_name || ''));
    };

    function selectize(sel){
      sel.selectize({
        plugins: ['remove_button', 'drag_drop'],
        persist: false,
        //openOnFocus: false,
        maxItems: 20,
        //maxOptions: 3,
        valueField: 'email',
        labelField: 'name',
        searchField: ['first_name', 'last_name', 'email'],
        sortField: [
          {field: 'first_name', direction: 'asc'},
          {field: 'last_name', direction: 'asc'}
        ],
        options: [
          {id:  1, email: 'nikola@tesla.com', first_name: 'Nikola', last_name: 'Tesla'},
          {id:  2, email: 'brian@thirdroute.com', first_name: 'Brian', last_name: 'Reavis'},
          {id:  3, email: 'izboran@gmail.com', first_name: 'Igor', last_name: 'Zboran'},
          {id:  4, email: 'a1@gmail.com', first_name: 'A1', last_name: 'Test1'},
          {id:  5, email: 'a2@gmail.com', first_name: 'A1', last_name: 'Test2'},
          {id:  6, email: 'a3@gmail.com', first_name: 'A3', last_name: 'Test3'},
          {id:  7, email: 'a4@gmail.com', first_name: 'A4', last_name: 'Test4'},
          {id:  8, email: 'a5@gmail.com', first_name: 'A5', last_name: 'Test5'},
          {id:  9, email: 'a6@gmail.com', first_name: 'A6', last_name: 'Test6'},
          {id: 10, email: 'someone@gmail.com'}
        ],
        render: {
          item: function(item, escape) {
            var name = formatName(item);
            return '<div>' +
              (name ? '<span class="sel-name">' + escape(name) + ' ' + '</span>' : '') +
              (item.email ? '<span class="sel-email">' + escape(item.email) + '</span>' : '') +
              '</div>';
          },
          option: function(item, escape) {
            var name = formatName(item);
            var label = name || item.email;
            var caption = name ? ' ' + item.email : null;
            return '<div>' +
              '<span class="sel-label">' + escape(label) + '</span>' +
              (caption ? '<span class="sel-caption">' + escape(caption) + '</span>' : '') +
              '</div>';
          }
        },
        create: function(input) {
          if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
            return {email: input};
          }
          var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
          if (match) {
            var name       = $.trim(match[1]);
            var pos_space  = name.indexOf(' ');
            var first_name = name.substring(0, pos_space);
            var last_name  = name.substring(pos_space + 1);

            return {
              id: -1,
              email: match[2],
              first_name: first_name,
              last_name: last_name
            };
          }
          alert('Invalid email address.');
          return false;
        },
        load: function(query, callback) {
          if (!query.length) return callback();
          $.ajax({
            url: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json',
            type: 'GET',
            dataType: 'jsonp',
            data: {
              q: query,
              page_limit: 10,
              apikey: '3qqmdwbuswut94jv4eua3j85'
            },
            error: function() {
              callback();
            },
            success: function(res) {
              console.log(res.movies);
              callback(res.movies);
            }
          });
        },
        onInitialize: function() {
          //
        }
      });
    }

    if (cnt == 1) {
      file  = files[0];

      view  = view.replace('{class}', fm.mime2class(file.mime));
      title = tpl.itemTitle.replace('{name}', fm.escape(file.i18 || file.name)).replace('{kind}', fm.mime2kind(file));

      if (file.tmb) {
        tmb = fm.option('tmbUrl')+file.tmb;
      }

      if (!file.read) {
        size = msg.unknown;
      } else if (file.mime != 'directory' || file.alias) {
        size = fm.formatSize(file.size);
      } else {
        size = tpl.spinner.replace('{text}', msg.calc);
        count.push(file.hash);
      }

      content.push(row.replace(l, msg.size).replace(v, size));

    } else {
      view  = view.replace('{class}', 'elfinder-cwd-icon-group');
      title = tpl.groupTitle.replace('{items}', msg.items).replace('{num}', cnt);
      dcnt  = $.map(files, function(f) { return f.mime == 'directory' ? 1 : null }).length;
      if (!dcnt) {
        size = 0;
        $.each(files, function(h, f) {
          var s = parseInt(f.size);

          if (s >= 0 && size >= 0) {
            size += s;
          } else {
            size = 'unknown';
          }
        });
        content.push(row.replace(l, msg.kind).replace(v, msg.files));
        content.push(row.replace(l, msg.size).replace(v, fm.formatSize(size)));
      } else {
        content.push(row.replace(l, msg.kind).replace(v, dcnt == cnt ? msg.folders : msg.folders+' '+dcnt+', '+msg.files+' '+(cnt-dcnt)))
        content.push(row.replace(l, msg.size).replace(v, tpl.spinner.replace('{text}', msg.calc)));
        count = $.map(files, function(f) { return f.hash });

      }
    }

    view = view.replace('{title}', title).replace('{content}', content.join(''));

    opts.buttons[fm.i18n('Save')]   = save;
    opts.buttons[fm.i18n('Cancel')] = cancel;

    dialog = fm.dialog(view, opts);

    dialog.attr('id', id);

    selectize($('#select-to'));

    $('.ui-dialog-buttonset').find('.ui-button:last').focus();

    // load thumbnail
    if (tmb) {
      $('<img/>')
        .load(function() { dialog.find('.elfinder-cwd-icon').css('background', 'url("'+tmb+'") center center no-repeat'); })
        .attr('src', tmb);
    }

    // send request to count total size
    if (count.length) {
      fm.request({
        data : {cmd : 'size', targets : count},
        preventDefault : true
      })
        .fail(function() {
          replSpinner(msg.unknown);
        })
        .done(function(data) {
          var size = parseInt(data.size);
          replSpinner(size >= 0 ? fm.formatSize(size) : msg.unknown);
        });
    }

  }

}

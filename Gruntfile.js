module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //合并js
        concat: {
            options: {
                //separator: ';'
            },
            allInOne: { //所有JS文件全部合并成一份文件
                src: ['dist/js/**/*.js'],
                dest: 'dest/src-concated/js/<%= pkg.name %>.js'
            }
        },
        //压缩js
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildall: { //按照原来的目录结构压缩所有JS文件
                options: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    },
                    report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: 'dist', //js目录
                    src: '**/*.js', //所有js文件
                    dest: 'dest/', //输出到此目录下
                    ext: '.min.js' //指定扩展名
                }]
            }
        },
        //压缩css
        cssmin: {
            //文件头部输出信息
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                //美化代码
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            my_target: {
                files: [{
                    expand: true,
                    //相对路径
                    cwd: 'dest/',
                    src: '**/*.css',
                    dest: 'dest/'
                }]
            }
        },
        //移动img，无压缩
        copy: {
            main: {
                files: [{
                        flatten: true,
                        expand: true,
                        src: 'dist/img/**',
                        dest: 'dest/img-origin/',
                        filter: 'isFile'
                    } // 复制img目录下的所有文件
                ]
            }
        },
        // 配置插件(图片压缩)
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 7 // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [{
                    expand: true, // 开启动态扩展
                    cwd: "dist/img/", // 当前工作路径
                    src: ["**/*.{png,jpg,gif}"], // 要出处理的文件格式(images下的所有png,jpg,gif)
                    dest: "dest/img/" // 输出目录(直接覆盖原图)
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 4 versions','firefox 11','opera 11']
            },
            my_target: {
                files: [{
                    expand: true,
                    //相对路径
                    cwd: 'dist/',
                    src: '**/*.css',
                    dest: 'dest/'
                }]
            }
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
            },
            src: {
                files: ['dist/js/**/*.js', 'dist/css/**/*.css', 'dist/img/**/*.{png,jpg,gif}'],
                tasks: ['default'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');//压缩js
    grunt.loadNpmTasks('grunt-contrib-concat');//合并
    grunt.loadNpmTasks('grunt-autoprefixer');//css3前缀
    grunt.loadNpmTasks('grunt-contrib-cssmin');//压缩css
    grunt.loadNpmTasks('grunt-contrib-copy');//文件copy
    grunt.loadNpmTasks('grunt-contrib-imagemin');//图片压缩
    grunt.loadNpmTasks('grunt-contrib-watch');//

    //grunt.registerTask('buildCss',  ['autoprefixer', 'cssmin']);
    //grunt.registerTask('copyImg',  ['copy', 'imagemin']);
    //grunt.registerTask('bulidJs',  ['concat', 'uglify']);
    grunt.registerTask('default', ['concat', 'uglify','autoprefixer', 'cssmin', 'copy','imagemin']);
};

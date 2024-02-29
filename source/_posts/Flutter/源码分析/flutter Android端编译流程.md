---
title: flutter Android端编译流程
toc: true
tags: Flutter
---



Android编译源码流程

`settings.gradle`配置

```dart
// 当前 app module
include ':app'

/**
 * 1、读取android/local.properties文件内容
 * 2、获取flutter.sdk的值，也就是你本地flutter SDK安装目录
 * 3、gradle 脚本常规操作 apply flutter SDK路径下/packages/flutter_tools/gradle/app_plugin_loader.gradle文件 
 */
def localPropertiesFile = new File(rootProject.projectDir, "local.properties")
def properties = new Properties()

assert localPropertiesFile.exists()
localPropertiesFile.withReader("UTF-8") { reader -> properties.load(reader) }

def flutterSdkPath = properties.getProperty("flutter.sdk")
assert flutterSdkPath != null, "flutter.sdk not set in local.properties"
apply from: "$flutterSdkPath/packages/flutter_tools/gradle/app_plugin_loader.gradle"

```

查看`app_plugin_loader.gradle`文件

```dart
import groovy.json.JsonSlurper
//得到自己新建的 flutter 项目的根路径，因为已经被自己新建的 project apply，所以这里是项目根路径哦
def flutterProjectRoot = rootProject.projectDir.parentFile

//获取自己项目根路径下的.flutter-plugins-dependencies json配置文件
// Note: if this logic is changed, also change the logic in module_plugin_loader.gradle.
def pluginsFile = new File(flutterProjectRoot, '.flutter-plugins-dependencies')
if (!pluginsFile.exists()) {
  return
}
/**
 * 1、通过groovy的JsonSlurper解析json文件内容。
 * 2、简单校验json内容字段的类型合法性。
 * 3、把安卓平台依赖的Flutter plugins全部自动include进来
 */
def object = new JsonSlurper().parseText(pluginsFile.text)
assert object instanceof Map
assert object.plugins instanceof Map
assert object.plugins.android instanceof List
// Includes the Flutter plugins that support the Android platform.
object.plugins.android.each { androidPlugin ->
  assert androidPlugin.name instanceof String
  assert androidPlugin.path instanceof String
  def pluginDirectory = new File(androidPlugin.path, 'android')
  assert pluginDirectory.exists()
  include ":${androidPlugin.name}"
  project(":${androidPlugin.name}").projectDir = pluginDirectory
}

```

我们在flutter项目中配置不同的plugin、package，会在项目根目录生成`.flutter-plugins-dependencies`，`app_plugin_loader.gradle`会将其中的Android部分库添加进来，用Android Studio打开android文件夹，会自动加载这些库。


在android文件夹下的`build.gradle`中:

```
//......省略无关紧要的常见配置
// 看到了吧，他将所有 android 依赖的构建产物挪到了根目录下的 build 中，所有产物都在那儿
rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "${rootProject.buildDir}/${project.name}"
    project.evaluationDependsOn(':app') //运行其他配置之前，先运行app依赖
}

```

然后看app模块下的`build.gradle`

```groovy
/**
 * 1、读取local.properties配置信息。
 * 2、获取flutter.sdk路径。
 * 3、获取flutter.versionCode值，此值在编译时自动从pubspec.yaml中读取赋值，所以修改版本号请修改yaml。
 * 4、获取flutter.versionName值，此值在编译时自动从pubspec.yaml中读取赋值，所以修改版本号请修改yaml。
 */
def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterRoot = localProperties.getProperty('flutter.sdk')
if (flutterRoot == null) {
    throw new GradleException("Flutter SDK not found. Define location with flutter.sdk in the local.properties file.")
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}
//常规操作，不解释
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
//重点1：apply 了 flutter SDK 下面的packages/flutter_tools/gradle/flutter.gradle脚本文件
apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    compileSdkVersion 30

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "cn.yan.f1"
        minSdkVersion 21
        targetSdkVersion 30
        versionCode flutterVersionCode.toInteger()	//赋值为yaml中读取的值
        versionName flutterVersionName	//赋值为yaml中读取的值
    }
	//......省略常规操作，不解释
}
//重点2：一个拓展配置，指定source路径为当前的两级父级，也就是项目根目录
flutter {
    source '../..'
}

//......省略常规操作，不解释

```

看看重点1`flutter.gradle`文件，它实际上运行了`flutter.groovy`这个文件


```groovy
//......省略一堆import头文件
/**
 * 常规脚本配置：脚本依赖仓库及依赖的 AGP 版本
 * 如果你自己没有全局配国内maven镜像，修改这里repositories也可以。
 * 如果你项目对于AGP这个版本不兼容，自己修改这里然后兼容也可以。
 */
buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.0'
    }
}
//java8编译配置
android {
    compileOptions {
        sourceCompatibility 1.8
        targetCompatibility 1.8
    }
}
//又 apply 了一个插件，只是这个插件源码直接定义在下方
apply plugin: FlutterPlugin

//FlutterPlugin插件实现源码，参考标准插件写法一样，基本语法不解释，这里重点看逻辑。
class FlutterPlugin implements Plugin<Project> {
    //......
	//重点入口！！！！！！
    @Override
    void apply(Project project) {
        this.project = project

        //1、配置maven仓库地址，环境变量有配置FLUTTER_STORAGE_BASE_URL就优先用，没就缺省
        String hostedRepository = System.env.FLUTTER_STORAGE_BASE_URL ?: DEFAULT_MAVEN_HOST
        String repository = useLocalEngine()
            ? project.property('local-engine-repo')
            : "$hostedRepository/download.flutter.io"
        project.rootProject.allprojects {
            repositories {
                maven {
                    url repository
                }
            }
        }
		//2、创建app模块中配置的flutter{ source: '../../'}闭包extensions
        project.extensions.create("flutter", FlutterExtension)
        //3、添加flutter构建相关的各种task
        this.addFlutterTasks(project)

        //4、判断编译命令flutter build apk --split-per-abi是否添加--split-per-abi参数，有的话就拆分成多个abi包。
        if (shouldSplitPerAbi()) {
            project.android {
                splits {
                    abi {
                        // Enables building multiple APKs per ABI.
                        enable true
                        // Resets the list of ABIs that Gradle should create APKs for to none.
                        reset()
                        // Specifies that we do not want to also generate a universal APK that includes all ABIs.
                        universalApk false
                    }
                }
            }
        }
		//5、判断编译命令是否添加deferred-component-names参数，有就配置android dynamicFeatures bundle特性。
        if (project.hasProperty('deferred-component-names')) {
            String[] componentNames = project.property('deferred-component-names').split(',').collect {":${it}"}
            project.android {
                dynamicFeatures = componentNames
            }
        }
        //6、判断编译命令是否添加--target-platform=xxxABI参数，没有就用缺省，有就看这个ABI是否flutter支持的，支持就配置，否则抛出异常。
        getTargetPlatforms().each { targetArch ->
            String abiValue = PLATFORM_ARCH_MAP[targetArch]
            project.android {
                if (shouldSplitPerAbi()) {
                    splits {
                        abi {
                            include abiValue
                        }
                    }
                }
            }
        }
		//7、通过属性配置获取flutter.sdk，或者通过环境变量FLUTTER_ROOT获取，都没有就抛出环境异常。
        String flutterRootPath = resolveProperty("flutter.sdk", System.env.FLUTTER_ROOT)
        if (flutterRootPath == null) {
            throw new GradleException("Flutter SDK not found. Define location with flutter.sdk in the local.properties file or with a FLUTTER_ROOT environment variable.")
        }
        flutterRoot = project.file(flutterRootPath)
        if (!flutterRoot.isDirectory()) {
            throw new GradleException("flutter.sdk must point to the Flutter SDK directory")
        }
		//8、获取Flutter Engine的版本号，如果通过local-engine-repo参数使用本地自己编译的Engine则版本为+，否则读取SDK目录下bin\internal\engine.version文件值，一串类似MD5的值。
        engineVersion = useLocalEngine()
            ? "+" // Match any version since there's only one.
            : "1.0.0-" + Paths.get(flutterRoot.absolutePath, "bin", "internal", "engine.version").toFile().text.trim()
		//9、依据平台获取对应flutter命令脚本，都位于SDK目录下bin\中，名字为flutter
        String flutterExecutableName = Os.isFamily(Os.FAMILY_WINDOWS) ? "flutter.bat" : "flutter"
        flutterExecutable = Paths.get(flutterRoot.absolutePath, "bin", flutterExecutableName).toFile();
		//10、获取flutter混淆配置清单，位于SDK路径下packages\flutter_tools\gradle\flutter_proguard_rules.pro。
		//里面配置只有 -dontwarn io.flutter.plugin.** 和 -dontwarn android.**
        String flutterProguardRules = Paths.get(flutterRoot.absolutePath, "packages", "flutter_tools",
                "gradle", "flutter_proguard_rules.pro")
        project.android.buildTypes {
            //11、新增profile构建类型，在当前project下的android.buildTypes中进行配置
            profile {
                initWith debug //initWith操作复制所有debug里面的属性
                if (it.hasProperty("matchingFallbacks")) {
                    matchingFallbacks = ["debug", "release"]
                }
            }
            //......
        }
        //......
        //12、给所有buildTypes添加依赖，addFlutterDependencies
        project.android.buildTypes.all this.&addFlutterDependencies
    }
	//......
}
//flutter{}闭包Extension定义
class FlutterExtension {
    String source
    String target
}
//......

```

接下来看看addFluterTasks方法，这是整个编译的重点：

```groovy
private void addFlutterTasks(Project project) {
	//gradle项目配置评估失败则返回，常规操作，忽略
    if (project.state.failure) {
        return
    }
    //1、一堆属性获取与赋值操作
    String[] fileSystemRootsValue = null
    if (project.hasProperty('filesystem-roots')) {
        fileSystemRootsValue = project.property('filesystem-roots').split('\\|')
    }
    String fileSystemSchemeValue = null
    if (project.hasProperty('filesystem-scheme')) {
        fileSystemSchemeValue = project.property('filesystem-scheme')
    }
    Boolean trackWidgetCreationValue = true
    if (project.hasProperty('track-widget-creation')) {
        trackWidgetCreationValue = project.property('track-widget-creation').toBoolean()
    }
    String extraFrontEndOptionsValue = null
    if (project.hasProperty('extra-front-end-options')) {
        extraFrontEndOptionsValue = project.property('extra-front-end-options')
    }
    String extraGenSnapshotOptionsValue = null
    if (project.hasProperty('extra-gen-snapshot-options')) {
        extraGenSnapshotOptionsValue = project.property('extra-gen-snapshot-options')
    }
    String splitDebugInfoValue = null
    if (project.hasProperty('split-debug-info')) {
        splitDebugInfoValue = project.property('split-debug-info')
    }
    Boolean dartObfuscationValue = false
    if (project.hasProperty('dart-obfuscation')) {
        dartObfuscationValue = project.property('dart-obfuscation').toBoolean();
    }
    Boolean treeShakeIconsOptionsValue = false
    if (project.hasProperty('tree-shake-icons')) {
        treeShakeIconsOptionsValue = project.property('tree-shake-icons').toBoolean()
    }
    String dartDefinesValue = null
    if (project.hasProperty('dart-defines')) {
        dartDefinesValue = project.property('dart-defines')
    }
    String bundleSkSLPathValue;
    if (project.hasProperty('bundle-sksl-path')) {
        bundleSkSLPathValue = project.property('bundle-sksl-path')
    }
    String performanceMeasurementFileValue;
    if (project.hasProperty('performance-measurement-file')) {
        performanceMeasurementFileValue = project.property('performance-measurement-file')
    }
    String codeSizeDirectoryValue;
    if (project.hasProperty('code-size-directory')) {
        codeSizeDirectoryValue = project.property('code-size-directory')
    }
    Boolean deferredComponentsValue = false
    if (project.hasProperty('deferred-components')) {
        deferredComponentsValue = project.property('deferred-components').toBoolean()
    }
    Boolean validateDeferredComponentsValue = true
    if (project.hasProperty('validate-deferred-components')) {
        validateDeferredComponentsValue = project.property('validate-deferred-components').toBoolean()
    }
    def targetPlatforms = getTargetPlatforms()
    ......
}

```

可以看到，addFlutterTasks 方法的第一部分比较简单，基本都是从 Project 中读取各自配置属性供后续步骤使用。所以我们接着继续看 addFlutterTasks 这个方法步骤 1 之后的部分

```groovy
private void addFlutterTasks(Project project) {
    //一堆属性获取与赋值操作
    //......
    //1、定义 addFlutterDeps 箭头函数，参数variant为标准构建对应的构建类型
    def addFlutterDeps = { variant ->
        if (shouldSplitPerAbi()) {
        	//2、常规操作：如果是构建多个变体apk模式就处理vc问题
            variant.outputs.each { output ->
                //由于GP商店不允许同一个应用的多个APK全都具有相同的版本信息，因此在上传到Play商店之前，您需要确保每个APK都有自己唯一的versionCode，这里就是做这个事情的。
                //具体可以看官方文档 https://developer.android.com/studio/build/configure-apk-splits
                def abiVersionCode = ABI_VERSION.get(output.getFilter(OutputFile.ABI))
                if (abiVersionCode != null) {
                    output.versionCodeOverride =
                        abiVersionCode * 1000 + variant.versionCode
                }
            }
        }
        //3、获取编译类型，variantBuildMode值为debug、profile、release之一
        String variantBuildMode = buildModeFor(variant.buildType)
        //4、依据参数生成一个task名字，譬如这里的compileFlutterBuildDebug、compileFlutterBuildProfile、compileFlutterBuildRelease
        String taskName = toCammelCase(["compile", FLUTTER_BUILD_PREFIX, variant.name])
        //5、给当前project创建compileFlutterBuildDebug、compileFlutterBuildProfile、compileFlutterBuildRelease Task
        //实现为FlutterTask，主要用来编译Flutter代码，这个task稍后单独分析
        FlutterTask compileTask = project.tasks.create(name: taskName, type: FlutterTask) {
        	//各种task属性赋值操作，基本都来自上面的属性获取或者匹配分析
            flutterRoot this.flutterRoot
            flutterExecutable this.flutterExecutable
            buildMode variantBuildMode
            localEngine this.localEngine
            localEngineSrcPath this.localEngineSrcPath
            //默认dart入口lib/main.dart、可以通过target属性自定义指向
            targetPath getFlutterTarget()
            verbose isVerbose()
            fastStart isFastStart()
            fileSystemRoots fileSystemRootsValue
            fileSystemScheme fileSystemSchemeValue
            trackWidgetCreation trackWidgetCreationValue
            targetPlatformValues = targetPlatforms
            sourceDir getFlutterSourceDirectory()
            //学到一个小技能，原来中间API是AndroidProject.FD_INTERMEDIATES，这也是flutter中间产物目录
            intermediateDir project.file("${project.buildDir}/${AndroidProject.FD_INTERMEDIATES}/flutter/${variant.name}/")
            extraFrontEndOptions extraFrontEndOptionsValue
            extraGenSnapshotOptions extraGenSnapshotOptionsValue
            splitDebugInfo splitDebugInfoValue
            treeShakeIcons treeShakeIconsOptionsValue
            dartObfuscation dartObfuscationValue
            dartDefines dartDefinesValue
            bundleSkSLPath bundleSkSLPathValue
            performanceMeasurementFile performanceMeasurementFileValue
            codeSizeDirectory codeSizeDirectoryValue
            deferredComponents deferredComponentsValue
            validateDeferredComponents validateDeferredComponentsValue
            //最后做一波权限相关处理
            doLast {
                project.exec {
                    if (Os.isFamily(Os.FAMILY_WINDOWS)) {
                        commandLine('cmd', '/c', "attrib -r ${assetsDirectory}/* /s")
                    } else {
                        commandLine('chmod', '-R', 'u+w', assetsDirectory)
                    }
                }
            }
        }
        //项目构建中间产物的文件，也就是根目录下build/intermediates/flutter/debug/libs.jar文件
        File libJar = project.file("${project.buildDir}/${AndroidProject.FD_INTERMEDIATES}/flutter/${variant.name}/libs.jar")
        //6、创建packLibsFlutterBuildProfile、packLibsFlutterBuildDebug、packLibsFlutterBuildRelease任务，主要是产物的复制挪位置操作，Jar 类型的 task
        //作用就是把build/intermediates/flutter/debug/下依据abi生成的app.so通过jar命令打包成build/intermediates/flutter/debug/libs.jar
        Task packFlutterAppAotTask = project.tasks.create(name: "packLibs${FLUTTER_BUILD_PREFIX}${variant.name.capitalize()}", type: Jar) {
        	//目标路径为build/intermediates/flutter/debug目录
            destinationDir libJar.parentFile
            //文件名为libs.jar
            archiveName libJar.name
            //依赖前面步骤5定义的compileFlutterBuildDebug，也就是说，这个task基本作用是产物处理
            dependsOn compileTask
            //targetPlatforms取值为android-arm、android-arm64、android-x86、android-x64
            targetPlatforms.each { targetPlatform ->
            	//abi取值为armeabi-v7a、arm64-v8a、x86、x86_64
                String abi = PLATFORM_ARCH_MAP[targetPlatform]
                //数据来源来自步骤5的compileFlutterBuildDebug任务中间产物目录
                //即把build/intermediates/flutter/debug/下依据abi生成的app.so通过jar命令打包成一个build/intermediates/flutter/debug/libs.jar文件
                from("${compileTask.intermediateDir}/${abi}") {
                    include "*.so"
                    // Move `app.so` to `lib/<abi>/libapp.so`
                    rename { String filename ->
                        return "lib/${abi}/lib${filename}"
                    }
                }
            }
        }
        //前面有介绍过addApiDependencies作用，把 packFlutterAppAotTask 产物加到依赖项里面参与编译
        //类似implementation files('libs.jar')，然后里面的so会在项目执行标准mergeDebugNativeLibs task时打包进标准lib目录
        addApiDependencies(project, variant.name, project.files {
            packFlutterAppAotTask
        })
        // 当构建有is-plugin属性时则编译aar
        boolean isBuildingAar = project.hasProperty('is-plugin')
        //7、当是Flutter Module方式，即Flutter以aar作为已存在native安卓项目依赖时才有这些:flutter:模块依赖，否则没有这些task
        //可以参见新建的FlutterModule中.android/include_flutter.groovy中gradle.project(":flutter").projectDir实现
        Task packageAssets = project.tasks.findByPath(":flutter:package${variant.name.capitalize()}Assets")
        Task cleanPackageAssets = project.tasks.findByPath(":flutter:cleanPackage${variant.name.capitalize()}Assets")
        //判断是否为FlutterModule依赖
        boolean isUsedAsSubproject = packageAssets && cleanPackageAssets && !isBuildingAar
        //8、新建copyFlutterAssetsDebug task，目的就是copy产物，也就是assets归档
        //常规merge中间产物类似，不再过多解释，就是把步骤5 task产物的assets目录在mergeAssets时复制到主包中间产物目录
        Task copyFlutterAssetsTask = project.tasks.create(
            name: "copyFlutterAssets${variant.name.capitalize()}",
            type: Copy,
        ) {
            dependsOn compileTask
            with compileTask.assets
            if (isUsedAsSubproject) {
                dependsOn packageAssets
                dependsOn cleanPackageAssets
                into packageAssets.outputDir
                return
            }
            // `variant.mergeAssets` will be removed at the end of 2019.
            def mergeAssets = variant.hasProperty("mergeAssetsProvider") ?
                variant.mergeAssetsProvider.get() : variant.mergeAssets
            dependsOn mergeAssets
            dependsOn "clean${mergeAssets.name.capitalize()}"
            mergeAssets.mustRunAfter("clean${mergeAssets.name.capitalize()}")
            into mergeAssets.outputDir
        }
        if (!isUsedAsSubproject) {
            def variantOutput = variant.outputs.first()
            def processResources = variantOutput.hasProperty("processResourcesProvider") ?
                variantOutput.processResourcesProvider.get() : variantOutput.processResources
            processResources.dependsOn(copyFlutterAssetsTask)
        }
        return copyFlutterAssetsTask
    } // end def addFlutterDeps
	......
}

```

以上大部分代码只是为了执行以下脚本时准备配置参数

```shell
flutter assemble --no-version-check \
--depfile build/app/intermediates/flutter/release/flutter_build.d \
--output build/app/intermediates/flutter/release/ \
-dTargetFile=lib/main.dart \
-dTargetPlatform=android \
-dBuildMode=release \
-dDartObfuscation=true \
android_aot_bundle_release_android-arm \
android_aot_bundle_release_android-arm64 \
android_aot_bundle_release_android-x86 \
android_aot_bundle_release_android-x64

```


## Flutter SDK下bin/flutter编译命令分析


flutter脚本如下：

```shell
#!/usr/bin/env bash
#1、该命令之后出现的代码，一旦出现了返回值非零，整个脚本就会立即退出，那么就可以避免一些脚本的危险操作。
set -e
#2、清空CDPATH变量值
unset CDPATH

# 在Mac上，readlink -f不起作用，因此follow_links一次遍历一个链接的路径，然后遍历cd进入链接目的地并找出它。
# 返回的文件系统路径必须是Dart的URI解析器可用的格式，因为Dart命令行工具将其参数视为文件URI，而不是文件名。
# 例如，多个连续的斜杠应该减少为一个斜杠，因为双斜杠表示URI的authority。
function follow_links() (
  cd -P "$(dirname -- "$1")"
  file="$PWD/$(basename -- "$1")"
  while [[ -h "$file" ]]; do
    cd -P "$(dirname -- "$file")"
    file="$(readlink -- "$file")"
    cd -P "$(dirname -- "$file")"
    file="$PWD/$(basename -- "$file")"
  done
  echo "$file"
)
# 这个变量的值就是Flutter SDK根目录下的bin/flutter
PROG_NAME="$(follow_links "${BASH_SOURCE[0]}")"
BIN_DIR="$(cd "${PROG_NAME%/*}" ; pwd -P)"
OS="$(uname -s)"

# 平台兼容
if [[ $OS =~ MINGW.* || $OS =~ CYGWIN.* ]]; then
  exec "${BIN_DIR}/flutter.bat" "$@"
fi

#3、source导入这个shell脚本后执行其内部的shared::execute方法
source "$BIN_DIR/internal/shared.sh"
shared::execute "$@"

```

关注`shared.sh`文件

```shell
#......
function shared::execute() {
  #1、默认FLUTTER_ROOT值为FlutterSDK根路径
  export FLUTTER_ROOT="$(cd "${BIN_DIR}/.." ; pwd -P)"
  #2、如果存在就先执行bootstrap脚本，默认SDK下面是没有这个文件的，我猜是预留给我们自定义初始化挂载用的。
  BOOTSTRAP_PATH="$FLUTTER_ROOT/bin/internal/bootstrap.sh"
  if [ -f "$BOOTSTRAP_PATH" ]; then
    source "$BOOTSTRAP_PATH"
  fi
  #3、一堆基于FlutterSDK路径的位置定义
  FLUTTER_TOOLS_DIR="$FLUTTER_ROOT/packages/flutter_tools"
  SNAPSHOT_PATH="$FLUTTER_ROOT/bin/cache/flutter_tools.snapshot"
  STAMP_PATH="$FLUTTER_ROOT/bin/cache/flutter_tools.stamp"
  SCRIPT_PATH="$FLUTTER_TOOLS_DIR/bin/flutter_tools.dart"
  DART_SDK_PATH="$FLUTTER_ROOT/bin/cache/dart-sdk"

  DART="$DART_SDK_PATH/bin/dart"
  PUB="$DART_SDK_PATH/bin/pub"

  #4、路径文件平台兼容，常规操作，忽略
  case "$(uname -s)" in
    MINGW*)
      DART="$DART.exe"
      PUB="$PUB.bat"
      ;;
  esac
  #5、测试运行脚本的账号是否为超级账号，是的话警告提示，Docker和CI环境不警告。
  if [[ "$EUID" == "0" && ! -f /.dockerenv && "$CI" != "true" && "$BOT" != "true" && "$CONTINUOUS_INTEGRATION" != "true" ]]; then
    >&2 echo "   Woah! You appear to be trying to run flutter as root."
    >&2 echo "   We strongly recommend running the flutter tool without superuser privileges."
    >&2 echo "  /"
    >&2 echo "📎"
  fi

  #6、测试git命令行环境配置是否正常，不正常就抛出错误。
  if ! hash git 2>/dev/null; then
    >&2 echo "Error: Unable to find git in your PATH."
    exit 1
  fi
  #7、FlutterSDK是否来自clone等测试。
  if [[ ! -e "$FLUTTER_ROOT/.git" ]]; then
    >&2 echo "Error: The Flutter directory is not a clone of the GitHub project."
    >&2 echo "       The flutter tool requires Git in order to operate properly;"
    >&2 echo "       to install Flutter, see the instructions at:"
    >&2 echo "       https://flutter.dev/get-started"
    exit 1
  fi

  # To debug the tool, you can uncomment the following lines to enable checked
  # mode and set an observatory port:
  # FLUTTER_TOOL_ARGS="--enable-asserts $FLUTTER_TOOL_ARGS"
  # FLUTTER_TOOL_ARGS="$FLUTTER_TOOL_ARGS --observe=65432"
  #7、日常编译遇到命令lock文件锁住问题就是他，本质该方法就是创建/bin/cache目录并维持锁状态等事情，不是我们关心的重点。
  upgrade_flutter 7< "$PROG_NAME"
  #8、相关参数值，别问我怎么知道的，问就是自己在源码对应位置echo输出打印的
  # BIN_NAME=flutter、PROG_NAME=FLUTTER_SDK_DIR/bin/flutter
  # DART=FLUTTER_SDK_DIR/bin/cache/dart-sdk/bin/dart
  # FLUTTER_TOOLS_DIR=FLUTTER_SDK_DIR/packages/flutter_tools
  # FLUTTER_TOOL_ARGS=空
  # SNAPSHOT_PATH=FLUTTER_SDK_DIR/bin/cache/flutter_tools.snapshot
  # @=build apk
  BIN_NAME="$(basename "$PROG_NAME")"
  case "$BIN_NAME" in
    flutter*)
      # FLUTTER_TOOL_ARGS aren't quoted below, because it is meant to be
      # considered as separate space-separated args.
      "$DART" --disable-dart-dev --packages="$FLUTTER_TOOLS_DIR/.packages" $FLUTTER_TOOL_ARGS "$SNAPSHOT_PATH" "$@"
      ;;
    dart*)
      "$DART" "$@"
      ;;
    *)
      >&2 echo "Error! Executable name $BIN_NAME not recognized!"
      exit 1
      ;;
  esac
}

```

可以看到，由于 Flutter SDK 内部内置了 Dart，所以当配置环境变量后 flutter、dart 命令都可以使用了。而我们安装 Flutter SDK 后首先做的事情就是把 SDK 的 bin 目录配置到了环境变量，所以执行的 flutter build apk、flutter upgrade、flutter pub xxx 等命令本质都是走进了上面这些脚本，且 flutter 命令只是对 dart 命令的一个包装，所以执行flutter pub get其实等价于dart pub get。所以假设我们执行flutter build apk命令，本质走到上面脚本最终执行的命令如下：

```shell
FLUTTER_SDK_DIR/bin/cache/dart-sdk/bin/dart \
--disable-dart-dev --packages=FLUTTER_SDK_DIR/packages/flutter_tools/.packages \
FLUTTER_SDK_DIR/bin/cache/flutter_tools.snapshot \
build apk

```

上面命令行中 FLUTTER_SDK_DIR 代表的就是 Flutter SDK 的根目录，--packages可以理解成是一堆 SDK 相关依赖，FLUTTER_SDK_DIR/bin/cache/flutter_tools.snapshot就是FLUTTER_SDK_DIR/packages/flutter_tools的编译产物。所以，上面其实通过 dart 命令执行flutter_tools.snapshot文件也就是等价于执行flutter_tools.dart的main()方法。因此上面命令继续简化大致如下:

```shell

dart --disable-dart-dev --packages=xxx flutter_tools.dart build apk

```

也就是说，我们执行的任何 flutter 命令，本质都是把参数传递到了FLUTTER_SDK_DIR/packages/flutter_tools/bin/flutter_tools.dart源码的 main 方法中


flutter_tools会执行flutter_tools/lib文件夹中的代码，不同的参数对应commands中不同的文件，比如build对应lib/src/commands/build.dart




## 参考



- [Flutter Android 工程结构及应用层编译源码深入分析](https://yanbober.blog.csdn.net/article/details/118758871)

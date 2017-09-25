CREATE TABLE `T_GradeSubjects` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Key',
`Faculty` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学部(小学部、初中部、高中部)',
`NameValue` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科目、年级',
`NameType` int(11) NOT NULL COMMENT '类型 0 :年级 1:科目',
`Isstate` int(11) NOT NULL COMMENT '是否启用 0：未启用 1:启用',
`CreateDate` varchar(32) NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) NULL COMMENT '修改日期',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '年级、科目常数表';

CREATE TABLE `T_Role` (
`Role_Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色Id，主键',
`Role_Name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
`Rights` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '权限,BigInteger计算',
`Parent_Id` varchar(100) NOT NULL DEFAULT 0 COMMENT '父节点，默认0为根节点（暂未启用，备用字段）',
`Btn_Sel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '查询权限,BigInteger计算',
`Btn_Edit` varchar(255) NOT NULL COMMENT '编辑权限,(增、删、改、导入、导出等),BigInteger计算',
`Isstate` int(11) NOT NULL COMMENT '是否启用 0:未启用 1:已启用',
`CreateDate` varchar(32) NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Role_Id`) 
)
COMMENT = '岗位角色表';

CREATE TABLE `T_Menu` (
`Menu_Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单Id，主键',
`Menu_Type` int(11) NOT NULL COMMENT '类型 0:前台 1:卓师app 2:卓学app',
`Menu_Name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '菜单名称',
`Menu_Url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '菜单路径',
`Parent_Id` int(11) NOT NULL DEFAULT 0 COMMENT '父节点',
`Menu_Order` int(11) NULL DEFAULT 0 COMMENT '排序',
`Menu_Icon` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '图标',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改人',
PRIMARY KEY (`Menu_Id`, `Menu_Type`) 
)
COMMENT = '前台菜单,手动配置';

CREATE TABLE `T_User` (
`PlatformNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '平台号,主键',
`Role_Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '所属角色Id,关联T_Role表',
`User_Name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户姓名',
`Phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '手机号',
`Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
`IdCard` varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '身份证',
`SchoolId` int(11) NULL DEFAULT 0 COMMENT '学校Id,如果为0则未绑定',
`WeChat` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '绑定的微信openid',
`QQ` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '绑定QQ的openid',
`Sina` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '绑定新浪微博的openid',
`User_Type` int(11) NULL COMMENT '用户类型 1:教师 2:学生 3:学校管理员',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`CurrentRole` int(11) NULL COMMENT '当前角色（用户当前登录所选择的角色， 总共2种\r\n私人:0,学校:对应学校Id)',
PRIMARY KEY (`PlatformNumber`) 
)
COMMENT = '教师、学生、学校管理者登录表';

CREATE TABLE `T_Teacher` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Key',
`SchoolId` int(11) NOT NULL COMMENT '学校Id',
`SubjectId` int(11) NULL COMMENT '科组Id,关联T_GradeSubjects表',
`User_Name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '教师名称',
`Sex` int(11) NULL COMMENT '性别 0:男 1:女',
`Age` int(11) NULL COMMENT '年龄',
`TeacherNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '教师工号',
`Phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '手机号',
`IdCard` varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证号',
`Nature` int(11) NULL COMMENT '教师性质 0:全职 1:兼职',
`Working` int(11) NULL COMMENT '在职状态 0:在职 1:离职',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '教师表';

CREATE TABLE `T_Student` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Key',
`SchoolId` int(11) NOT NULL COMMENT '学校Id',
`SubjectId` int(11) NULL COMMENT '科组Id,关联T_GradeSubjects表',
`GradeId` int(11) NULL COMMENT '年级Id,关联T_GradeSubjects表',
`ClassId` int(11) NULL COMMENT '班级Id,关联T_Class表',
`User_Name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学生名称',
`Sex` int(11) NULL COMMENT '性别 0:男 1:女',
`Age` int(11) NULL COMMENT '年龄',
`StudentNumber` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学籍号',
`Phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '手机号',
`IdCard` varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证号',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '学生表';

CREATE TABLE `T_School` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '学校Id,主键',
`SchoolName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学校名称',
`Nature` int(11) NULL COMMENT '学校性质 0:公立学校 1:私立学校 2:培训机构',
`Tel` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '联系电话',
`Email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '邮箱',
`Region` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '地区(省市区,逗号分隔)',
`Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '校址',
`SchoolType` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学段 0:小学 1:初中 2:高中 可多选 逗号分隔',
`LicenceUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '办学许可证图片路径',
`CardFrontUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '身份证正面图片路径',
`CardBackUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '身份证背面图片路径',
`LogoUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学校Logo图标路径',
`Domain` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学校域名网址',
`Introduction` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '学校简介',
`Isstate` int(11) NULL COMMENT '审核状态 0:未审核 1:审核通过 2:审核不通过',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
PRIMARY KEY (`Id`) 
)
COMMENT = '学校管理表';

CREATE TABLE `T_SchoolLog` (
`SchoolId` int(11) NULL COMMENT '关联学校Id',
`Isstate` int(11) NULL COMMENT '状态 0 :未审核 1:审核通过 2:审核不通过',
`Content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '内容(审核不通过原因)',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者'
)
COMMENT = '学校审核日志表';

CREATE TABLE `T_Class` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '班级Id，主键',
`GradeId` int(11) NULL COMMENT '年级Id,关联T_GradeSubjects表',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_School表',
`ClassName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '班级名称',
`ClassAdviserId` int(11) NULL COMMENT '班主任Id,关联T_Teacher表',
`StudentNum` int(11) NULL COMMENT '学生人数',
`TeacherNum` int(11) NULL COMMENT '教师人数',
`EnterYear` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '入学年份(依据年级自动计算)',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改人',
PRIMARY KEY (`Id`) 
)
COMMENT = '班级主表';

CREATE TABLE `T_ClassTeacher` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
`ClassId` int(11) NULL COMMENT '班级Id,关联T_Class表',
`TeacherId` int(11) NULL COMMENT '教师Id,关联T_Teacher表',
`SubjectsId` int(11) NULL COMMENT '科目Id,关联T_GradeSubjects表',
PRIMARY KEY (`Id`) 
)
COMMENT = '班级教师表';

CREATE TABLE `T_ClassStudent` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
`ClassId` int(11) NULL COMMENT '班级Id,关联T_Class表',
`StudentId` int(11) NULL COMMENT '学生Id,关联T_Student表',
PRIMARY KEY (`Id`) 
)
COMMENT = '班级学生表';

CREATE TABLE `T_ClassNotice` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
`ClassId` int(11) NULL COMMENT '班级Id,关联T_Class表',
`Title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '标题',
`Content` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '通告内容',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '班级通知';

CREATE TABLE `T_ClassLearning` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
`ClassId` int(11) NULL COMMENT '班级Id,关联T_Class表',
`SubjectsId` int(11) NULL COMMENT '科目Id,关联T_GradeSubjects表',
`LearType` int(11) NULL COMMENT '类型 0:作业 1:考试',
`Completion` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '完成情况 未提交人/本次作业总人数*100%=完成度',
`TotalScore` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '总分数',
`AverageScore` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '平均分',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
PRIMARY KEY (`Id`) 
)
COMMENT = '班级学员学习情况表';

CREATE TABLE `T_Knowledge` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
`SubjectsId` int(11) NULL COMMENT '科目Id,关联T_GradeSubjects表',
`Parent_Id` int(11) NULL COMMENT '父节点Id,默认0为根节点',
`KnowledgeName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '知识点名称',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '知识点管理表';

CREATE TABLE `T_TextbookVersion` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增Id,主键',
`SubjectsId` int NULL COMMENT '科目Id,关联T_GradeSubjects表',
`VersionName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '版本名称',
`Memo` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '教材版本管理表';

CREATE TABLE `T_Textbook` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`VersionId` int(11) NULL COMMENT '教材版本Id,关联T_TextbookVersion表',
`GradeId` int(11) NULL COMMENT '年级Id,关联T_GradeSubjects表',
`TextbookName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '教材名称',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`CrateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '教材管理表';

CREATE TABLE `T_Chapter` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长Id',
`TextbookId` int NULL COMMENT '教书Id,关联T_Textbook',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表',
`Parent_Id` int(11) NULL COMMENT '父节点，0为根节点',
`ChapterName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '章节名称',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '修改者',
PRIMARY KEY (`Id`) 
)
COMMENT = '章节管理表';

CREATE TABLE `T_Questions` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长',
`QuestionName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '试题出处名称',
`Year` int(11) NULL COMMENT '年限',
`Region` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '地区(省市区逗号分隔)',
`AdminNumber` int(11) NULL COMMENT '平台引用次数',
`SchoolNumber` int(11) NULL COMMENT '学校引用次数',
`TeacherNumber` int(11) NULL COMMENT '私人引用次数',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`UpdateDate` varchar(32) CHARACTER SET utf8 NULL COMMENT '修改时间',
`UpdateUser` varchar(50) CHARACTER SET utf8 NULL COMMENT '修改人',
PRIMARY KEY (`Id`) 
)
COMMENT = '题库管理表,设置试题出处';

CREATE TABLE `T_QuMathRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '数学单选题管理';

CREATE TABLE `T_QuMathRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuMathRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '数学单选题选项管理';

CREATE TABLE `T_QuMathMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '数学多选题管理';

CREATE TABLE `T_QuMathMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuMathMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '数学多选题选项管理';

CREATE TABLE `T_QuMathJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '数学判断题管理';

CREATE TABLE `T_QuMathFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '数学填空题管理';

CREATE TABLE `T_QuMathAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuMathAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '数学解答题问题管理';

CREATE TABLE `T_QuPhyRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuPhyRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '物理单选题选项管理';

CREATE TABLE `T_QuPhyMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuPhyMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '物理多选题选项管理';

CREATE TABLE `T_QuPhyAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuPhyAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '物理解答题问题管理';

CREATE TABLE `T_QuChemiRadioOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '化学单选题选项管理';

CREATE TABLE `T_QuChemiMultiselectOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '化学多选题选项管理';

CREATE TABLE `T_QuChemiAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuChemiAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '化学解答题问题管理';

CREATE TABLE `T_QuGeogRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuGeogRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '地理单选题选项管理';

CREATE TABLE `T_QuGeogMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuGeogMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '地理多选题选项管理';

CREATE TABLE `T_QuGeogAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuGeogAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '地理解答题问题管理';

CREATE TABLE `T_QuBiolRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuBiolRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '生物单选题选项管理';

CREATE TABLE `T_QuBiolMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuBiolMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '生物多选题选项管理';

CREATE TABLE `T_QuBiolAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuBiolAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '生物解答题问题管理';

CREATE TABLE `T_QuHstRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuHstRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '历史单选题选项管理';

CREATE TABLE `T_QuHstMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuHstMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '历史多选题选项管理';

CREATE TABLE `T_QuHstAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuHstAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '历史解答题问题管理';

CREATE TABLE `T_QuPolRadioOpt` (
`QuId` int(11) NULL COMMENT '单选题Id,关联T_QuPolRadio表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '政治单选题选项管理';

CREATE TABLE `T_QuPolMultiselectOpt` (
`QuId` int(11) NULL COMMENT '多选题Id,关联T_QuPolMultiselect表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '政治多选题选项管理';

CREATE TABLE `T_QuPolAnswerOpt` (
`QuId` int(11) NULL COMMENT '解答题Id,关联T_QuPolAnswer表',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '政治解答题问题管理';

CREATE TABLE `T_QuLog` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id,子增长',
`SubjectId` int NULL COMMENT '试题Id,关联对应试题表Id',
`SubjectTypeId` int(11) NULL COMMENT '所属科目Id,关联T_GradeSubjects表',
`Content` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '审核不通过原因',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '试题审核表,仅记录审核不通过的';

CREATE TABLE `T_QuChnRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '语文单选题管理';

CREATE TABLE `T_QuChnFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '语文多选题管理';

CREATE TABLE `1` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语单选题管理';

CREATE TABLE `2` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语多选题管理';

CREATE TABLE `T_QuTestCart` (
`Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '唯一id,Guid',
`TestPaperId` int(11) NULL COMMENT '试卷Id,关联T_QuOldTestPaper表',
`SubjectId` int(11) NULL COMMENT '试题Id,关联对应试题表Id',
`SubjectTypeId` int(11) NULL COMMENT '所属科目Id,关联T_GradeSubjects表',
`QuType` int(11) NULL COMMENT '试题类型 0:单选 1:多选 2:判断 3:填空 4:解答 5:现代文阅读 6:文言文 7:诗歌鉴赏 8:语言表达 9:名著解读 10:默写 11:写作 12:完形填空 13:阅读理解 14:书目表达 15:句型转换 16:单词拼写 17:补充句子 18:翻译 19:改错 20:单词造句',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师'
)
COMMENT = '后台试题蓝(购物车)';

CREATE TABLE `T_QuOldTestPaper` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`QuId` int(11) NULL COMMENT '试题出处Id,关联T_Questions表',
`GradeId` int(11) NULL COMMENT '年级Id,自动关联科目,关联T_GradeSubjects表',
`Title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '名称',
`Year` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '年份',
`Region` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '地区 省市区逗号分隔',
`TotalScore` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '总分数',
`Isstate` int(11) NULL COMMENT '是否启用 0:未启用 1:已启用',
`PaperIsstate` int(11) NULL COMMENT '组卷是否完成 0:未完成 1:已完成',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`QuType` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题型数量json字符串',
PRIMARY KEY (`Id`) 
)
COMMENT = '后台套题管理(真题)';

CREATE TABLE `T_QuPaperAttribute` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长Id',
`GradeId` int(11) NULL COMMENT '年级Id,自动关联科目',
`TestPaperId` int(11) NULL COMMENT '试卷Id,关联T_QuOldTestPaper表',
`Describe` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '描述',
`AttributeType` int NULL COMMENT '类型 0:同步套题 1:段考套题 2:真题试卷',
`ProblemMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '出题人',
`AttributeJson` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '教材版本Id,课本Id,章Id,节Id,分类(月考,期中,期末) json字符串',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '后台试卷属性';

CREATE TABLE `T_QuScore` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长',
`TestPaperId` int(11) NULL COMMENT '试卷Id,关联T_QuOldTestPaper表',
`ScoreJson` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '分数,排序设置 Json字符串',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '后台试卷结构,分数管理';

CREATE TABLE `T_QuTest` (
`Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '唯一id,Guid',
`TestPaperId` int(11) NULL COMMENT '试卷Id,关联T_QuOldTestPaper表',
`SubjectId` int(11) NULL COMMENT '试题Id,关联对应试题表Id',
`SubjectTypeId` int(11) NULL COMMENT '所属科目Id,关联T_GradeSubjects表',
`QuType` int(11) NULL COMMENT '试题类型 0:单选 1:多选 2:判断 3:填空 4:解答 5:现代文阅读 6:文言文 7:诗歌鉴赏 8:语言表达 9:名著解读 10:默写 11:写作 12:完形填空 13:阅读理解 14:书目表达 15:句型转换 16:单词拼写 17:补充句子 18:翻译 19:改错 20:单词造句',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师'
)
COMMENT = '后台试题';

CREATE TABLE `T_UserTestCart` (
`Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '唯一id,Guid',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_School表,0为个人',
`SubjectId` int(11) NULL COMMENT '试题Id,关联对应试题表Id',
`SubjectTypeId` int(11) NULL COMMENT '所属科目Id,关联T_GradeSubjects表',
`QuType` int(11) NULL COMMENT '试题类型 0:单选 1:多选 2:判断 3:填空 4:解答 5:现代文阅读 6:文言文 7:诗歌鉴赏 8:语言表达 9:名著解读 10:默写 11:写作 12:完形填空 13:阅读理解 14:书目表达 15:句型转换 16:单词拼写 17:补充句子 18:翻译 19:改错 20:单词造句',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者'
)
COMMENT = '前台试题蓝(购物车)';

CREATE TABLE `T_UserPaperAttribute` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_School表',
`GradeId` int(11) NULL COMMENT '年级Id,自动关联科目',
`Describe` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '描述',
`AttributeType` int NULL COMMENT '类型 0:课后作业 1:阶段考试 2:套题题库',
`ProblemMaker` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '出题人',
`AttributeJson` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '教材版本Id,课本Id,章Id,节Id,分类(月考,期中,期末) json字符串',
`ReleaseType` int(11) NULL COMMENT '发布类型 0:班级 1:学生',
`ReleaseDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '发布时间',
`Isstate` int(11) NULL COMMENT '是否发布 0:未发布 1:已发布',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '前台试卷属性';

CREATE TABLE `T_UserScore` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增长',
`AttributeId` int(11) NULL COMMENT '试卷属于Id,关联T_UserPaperAttribute表',
`ScoreJson` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '分数,排序设置 Json字符串',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
PRIMARY KEY (`Id`) 
)
COMMENT = '前台试卷结构,分数管理';

CREATE TABLE `T_UserTest` (
`Id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '唯一id,Guid',
`AttributeId` int(11) NULL COMMENT '试卷属于Id,关联T_UserPaperAttribute表',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_School表,0为个人',
`SubjectId` int(11) NULL COMMENT '试题Id,关联对应试题表Id',
`SubjectTypeId` int(11) NULL COMMENT '所属科目Id,关联T_GradeSubjects表',
`QuType` int(11) NULL COMMENT '试题类型 0:单选 1:多选 2:判断 3:填空 4:解答 5:现代文阅读 6:文言文 7:诗歌鉴赏 8:语言表达 9:名著解读 10:默写 11:写作 12:完形填空 13:阅读理解 14:书目表达 15:句型转换 16:单词拼写 17:补充句子 18:翻译 19:改错 20:单词造句',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者'
)
COMMENT = '前台试题';

CREATE TABLE `T_QuChnModernReading` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '现代文阅读管理';

CREATE TABLE `T_QuMathAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '数学解答题管理';

CREATE TABLE `T_QuChnModernReadingOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '现代文阅读问题管理';

CREATE TABLE `T_QuChnClassical` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '文言文管理';

CREATE TABLE `T_QuChnClassicalOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '文言文问题管理';

CREATE TABLE `T_QuChnPoetry` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '诗歌鉴赏管理';

CREATE TABLE `T_QuChnPoetryOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '诗歌鉴赏问题管理';

CREATE TABLE `T_QuChnLanguage` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '语言表达管理';

CREATE TABLE `T_QuChnLanguageOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '语言表达问题管理';

CREATE TABLE `T_QuChnMasterpiece` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '名著解读管理';

CREATE TABLE `T_QuChnMasterpieceOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '名著解读问题管理';

CREATE TABLE `T_QuChnDictation` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '默写管理';

CREATE TABLE `T_QuChnDictationOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '默写问题管理';

CREATE TABLE `T_QuChnWriting` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '写作管理';

CREATE TABLE `T_QuChnWritingOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '默写问题管理';

CREATE TABLE `T_QuEngReading` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语阅读理解管理';

CREATE TABLE `T_QuEngReadingOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语阅读理解问题管理';

CREATE TABLE `T_QuEngSentence` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语句型转换管理';

CREATE TABLE `T_QuEngSentenceOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语句型转换问题管理';

CREATE TABLE `T_QuEngWordSpelling` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语单词拼写管理';

CREATE TABLE `T_QuEngWordSpellingOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语单词拼写问题管理';

CREATE TABLE `T_QuEngTranslate` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语翻译管理';

CREATE TABLE `T_QuEngTranslateOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语翻译问题管理';

CREATE TABLE `T_QuEngError` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语改错管理';

CREATE TABLE `T_QuEngErrorOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语改错问题管理';

CREATE TABLE `T_QuEngWord` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语单词造句管理';

CREATE TABLE `T_QuEngWordOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语单词造句问题管理';

CREATE TABLE `T_QuEngWritten` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语书面表达管理';

CREATE TABLE `T_QuEngWrittenOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`IsImage` int(11) NULL COMMENT '是否图片 0:否 1:是'
)
COMMENT = '英语书面表达问题管理';

CREATE TABLE `T_QuEngClozeTest` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语完形填空管理';

CREATE TABLE `T_QuEngClozeTestOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '问题',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选时逗号分隔',
`Option` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项 存储为json字符串,展示例如 A.xxx B.xxx C.xxxx D.xxxx'
)
COMMENT = '英语完形填空问题管理';

CREATE TABLE `T_QuEngSupplementary` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语补充句子管理';

CREATE TABLE `T_QuEngSupplementaryOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '问题',
`Sort` int(11) NULL COMMENT '排序',
`Answer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选时逗号分隔',
`Option` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项 存储为json字符串,展示例如 A.xxx B.xxx C.xxxx D.xxxx'
)
COMMENT = '英语补充句子问题管理';

CREATE TABLE `T_QuChnRadioOtp` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '语文单选题选项管理';

CREATE TABLE `T_QuChnFillinOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '语文多选题选项管理';

CREATE TABLE `T_QuEngRadioOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '英语单选题选项管理';

CREATE TABLE `T_QuEngFillinOpt` (
`QuId` int(11) NULL COMMENT '关联Id,关联对应表(当前表名去掉Opt)',
`QuTitle` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '选项',
`Sort` int(11) NULL COMMENT '排序'
)
COMMENT = '英语多选题选项管理';

CREATE TABLE `T_QuHstAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '历史解答题管理';

CREATE TABLE `T_QuHstFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '历史填空题管理';

CREATE TABLE `T_QuHstJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '历史判断题管理';

CREATE TABLE `T_QuHstMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '历史多选题管理';

CREATE TABLE `T_QuHstRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '历史单选题管理';

CREATE TABLE `T_QuPolAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '政治解答题管理';

CREATE TABLE `T_QuPolFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '政治填空题管理';

CREATE TABLE `T_QuPolJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '政治判断题管理';

CREATE TABLE `T_QuPolMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '政治多选题管理';

CREATE TABLE `T_QuPolRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '政治单选题管理';

CREATE TABLE `T_QuGeogAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '地理解答题管理';

CREATE TABLE `T_QuGeogFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '地理填空题管理';

CREATE TABLE `T_QuGeogJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '地理判断题管理';

CREATE TABLE `T_QuGeogMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '地理多选题管理';

CREATE TABLE `T_QuGeogRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '地理单选题管理';

CREATE TABLE `T_QuPhyAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '物理解答题管理';

CREATE TABLE `T_QuPhyFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '物理填空题管理';

CREATE TABLE `T_QuPhyJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '物理判断题管理';

CREATE TABLE `T_QuPhyMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '物理多选题管理';

CREATE TABLE `T_QuPhyRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '物理单选题管理';

CREATE TABLE `T_QuChemiAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '化学解答题管理';

CREATE TABLE `T_QuChemiFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '化学填空题管理';

CREATE TABLE `T_QuChemiJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '化学判断题管理';

CREATE TABLE `T_QuChemiMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '化学多选题管理';

CREATE TABLE `T_QuChemiRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '化学单选题管理';

CREATE TABLE `T_QuBiolAnswer` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Analysis` varchar(4000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '生物解答题管理';

CREATE TABLE `T_QuBiolFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多个答案可用[@]区分 可传图片',
`IsImage` int(11) NULL COMMENT '答案是否图片 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '生物填空题管理';

CREATE TABLE `T_QuBiolJudgment` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案 0:否 1:是',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '生物判断题管理';

CREATE TABLE `T_QuBiolMultiselect` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '生物多选题管理';

CREATE TABLE `T_QuBiolRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '生物单选题管理';

CREATE TABLE `T_QuEngRadio` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int(11) NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语单选题管理';

CREATE TABLE `T_QuEngFillin` (
`Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自增Id',
`SchoolId` int(11) NULL COMMENT '学校Id,关联T_SchoolId表,为0代表平台或者私人试题',
`Title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '题干',
`Answer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案,多选逗号区分',
`Analysis` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '试题解析',
`CreateDate` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建时间',
`CreateUser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '创建者',
`CreateUserType` int(11) NULL COMMENT '用户类型 0:平台 1:学校 2:教师',
`QuestionType` int(11) NULL COMMENT '试题范围 0:平台 1:学校 2:教师(私人)',
`Isstate` int(11) NULL COMMENT '审核 0:未审核 1:审核通过 2:审核不通过',
`FacilityValue` int(11) NULL COMMENT '难易度,0:容易 1:中等 2:困难',
`ChapterId` int NULL COMMENT '章节点Id,关联T_Chapter表 默认0为空',
`KnowledgeId` int(11) NULL COMMENT '知识点Id,关联T_Knowledge表 默认0为空',
`QuoteNum` int(11) NULL COMMENT '引用次数',
`CollectionNum` int(11) NULL COMMENT '收藏次数',
`CorrectRate` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '正确率',
PRIMARY KEY (`Id`) 
)
COMMENT = '英语多选题管理';


// import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MoreThan, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../users/entities/user.entity';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import {MailerService} from '@nestjs-modules/mailer';
// import * as crypto from 'crypto';
// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//     private mailerService: MailerService,
//   ) {}
// // forgot password
//   async forgotPassword(email:string){
//     const user = await this.userRepository.findOne({where:{email}})
//     if(!user){
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpiry = new Date(Date.now() + 36000 *1000);
//     await this.userRepository.save(user);
//     const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
//     await this.mailerService.sendMail({
//       to:user.email,
//       subject:'Reset Password',
//       template:'./reset-password',
//       context:{
//         resetLink,
//       },
//       html:`
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetLink}">Reset Password</a>
//       `,
//     });
//     return {
//       message:'Password reset email sent successfully',
//     }
//   }

// // reset password
//   async resetPassword(token:string, newPassword:string){
//     const user = await this.userRepository.findOne({
//       where:{
//         resetPasswordToken:token,
//         resetPasswordExpiry:MoreThan(new Date()),
//       },
//     });
//     if(!user){
//       console.log('Invalid token');
//       throw new UnauthorizedException('Invalid token');
//     }
//     const hashedPassword = await bcrypt.hash(newPassword,10);

//     user.password = hashedPassword;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpiry = null;
//     await this.userRepository.save(user);
//     return {
//       message:'Password reset successfully',
//     }

//   }

//   async validateUserByPassword(email:string,pass:string):Promise<any>{

//     console.log('1. Trying to login with email:', email); // لنرى الإيميل الواصل
//   console.log('2. Password provided:', pass);




//     const user = await this.userRepository.findOne({where:{email}});
//     if (user && await bcrypt.compare(pass,user.password)){
//       const {password,...rest} = user;
//       return rest
//     }
//     return null;
//   }

// // register
//   async register(registerDto: RegisterDto) {
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({
//       where: [
//         { email: registerDto.email },
//         { phoneNumber: registerDto.phone },
//       ],
//     });

//     if (existingUser) {
//       console.log('User already exists');
//       throw new ConflictException('Email or phone already exists');
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(registerDto.password, 10);

// // Create new user
//     const user = this.userRepository.create({
//       username: registerDto.username,
//       email: registerDto.email,
//       fullName: registerDto.fullName,
//       phoneNumber: registerDto.phone,  // Map 'phone' to 'phoneNumber'
//       passwordHash: hashedPassword,
//       role: 'user'
//     });
//     await this.userRepository.save(user);

//     // Generate JWT token
//     const payload = { sub: user.userId, email: user.email };
//     const token = this.jwtService.sign(payload);

//     // Remove password from response
//     delete user.passwordHash;

//     return {
//       user,
//       token,
//     };
//   }

// // login
//   async login(loginDto: LoginDto) {
//     // Find user by email
//     const user = await this.userRepository.findOne({
//       where: { email: loginDto.email },
//     });

//     if (!user) {
//       console.log('User not found');
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     console.log('✅ User found. Hashed password in DB is:', user.password);

//     // Check password
//     const isPasswordValid = await bcrypt.compare(
//       loginDto.password,
//       user.passwordHash,
//     );

//     if (!isPasswordValid) {
//       console.log('Invalid password');
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // Generate JWT token
//     const payload = { sub: user.userId, email: user.email };
//     const token = this.jwtService.sign(payload);

//     // Remove password from response
//     delete user.passwordHash;

//     return {
//       user,
//       token,
//     };
//   }

// // validate user
//   async validateUser(userId: number) {
//     return await this.userRepository.findOne({
//       where: { userId },
//     });
//   }

// }
//==================================================================================================================================
// import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MoreThan, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../users/entities/user.entity';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { MailerService } from '@nestjs-modules/mailer';
// import * as crypto from 'crypto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//     private mailerService: MailerService,
//   ) { }

//   // ----------------------------------------------------------------
//   // 1. Validate User (تصحيح الاسم هنا)
//   // ----------------------------------------------------------------
//   async validateUserByPassword(email: string, pass: string): Promise<any> {
//     console.log('1. Login attempt for:', email);

//     // نستخدم createQueryBuilder لجلب العمود المخفي
//     const user = await this.userRepository
//       .createQueryBuilder('user')
//       .addSelect('user.passwordHash') // ✅ التعديل: جلب passwordHash
//       .where('user.email = :email', { email })
//       .getOne();

//     console.log('2. User found:', user ? 'YES' : 'NO');

//     if (user) {
//       // طباعة للتأكد
//       console.log('3. Hash from DB:', user.passwordHash ? 'Exists' : 'Undefined');
//     }

//     // ✅ التعديل: مقارنة مع passwordHash
//     if (user && (await bcrypt.compare(pass, user.passwordHash))) {
//       // نحذف الهاش من النتيجة قبل إرجاعها
//       const { passwordHash, ...rest } = user;
//       return rest;
//     }

//     return null;
//   }

//   // ----------------------------------------------------------------
//   // 2. Login
//   // ----------------------------------------------------------------
//   async login(loginDto: LoginDto) {
//     try {
//       // نستدعي دالة التحقق المعدلة أعلاه
//       const user = await this.validateUserByPassword(loginDto.email, loginDto.password);

//       if (!user) {
//         console.log('Invalid credentials');
//         throw new UnauthorizedException('Invalid credentials');
//       }
//       console.log('User Object from DB:', user);
//       const storedHash = user.password_hash || user.passwordHash;
//       if (!storedHash) {
//         throw new InternalServerErrorException('لم يتم العثور على كلمة مرور مشفرة لهذا المستخدم في القاعدة');
//       }

//       if (!loginDto.password) {
//         throw new BadRequestException('كلمة المرور مطلوبة');
//       }

//       const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
//       if (!isMatch) {
//         throw new UnauthorizedException('كلمة المرور غير صحيحة');
//       }
//       if (!user.is_verified && !user.isVerified) {
//         throw new UnauthorizedException('PENDING_VERIFICATION');
//       }

//       if (!user.isVerified) {
//         // نرسل خطأ خاص ليفهمه الفرونت إند
//         throw new UnauthorizedException('PENDING_VERIFICATION');
//       }

//       // توليد التوكن
//       const payload = { sub: user.userId, email: user.email };
//       const token = this.jwtService.sign(payload);

//       return {
//         user: user,
//         token: this.jwtService.sign(payload),
//       };
//     } catch (error) {
//       console.error("LOGIN_ERROR_DETAIL:", error);
//       if (error instanceof UnauthorizedException) throw error;
//       throw new InternalServerErrorException('حدث خطأ أثناء إصدار تصريح الدخول');
      
//     }
//   }

//   // ----------------------------------------------------------------
//   // 3. Register
//   // ----------------------------------------------------------------
//   async register(registerDto: RegisterDto) {
//     const existingUser = await this.userRepository.findOne({
//       where: [
//         { email: registerDto.email },
//         { phoneNumber: registerDto.phone },
//       ],
//     });

//     if (existingUser) {
//       throw new ConflictException('Email or phone already exists');
//     }

//     const hashedPassword = await bcrypt.hash(registerDto.password, 10);
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const user = this.userRepository.create({
//       username: registerDto.username,
//       email: registerDto.email,
//       fullName: registerDto.fullName,
//       phoneNumber: registerDto.phone,
//       passwordHash: hashedPassword, // ✅ التعديل: تخزين في passwordHash
//       role: 'user',
//       verificationCode: verificationCode,
//       verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000), // صالح لـ 15 دقيقة
//       isVerified: false,
//       userType: registerDto.userType || 'both',
//       provinceId: registerDto.province_id,
//       cityId: registerDto.city_id,
//     });

//     await this.userRepository.save(user);

//     const payload = { sub: user.userId, email: user.email };
//     const token = this.jwtService.sign(payload);

//     // @ts-ignore
//     delete user.passwordHash; // إخفاء الهاش من الرد

//     await this.mailerService.sendMail({
//       to: user.email,
//       subject: 'Verify your email',
//       template: './verify-email',
//       html: `
//       <h3>Your Verification Code is: <b>${verificationCode}</b></h3>
//       `
//     });

//     return {
//       user: user,
//       token: token,
//       message: 'Registration successful. Please check your email for OTP.'
//     };


//     // @ts-ignore
//     delete user.verificationCode;
//     delete user.verificationCodeExpiry;
//     delete user.isVerified;
//     return { user, token };
//   }

//   async verifyEmail(email: string, code: string) {
//     const user = await this.userRepository.findOne({ where: { email } });

//     if (!user) throw new BadRequestException('User not found');

//     if (user.isVerified) throw new BadRequestException('User already verified');

//     if (user.verificationCode !== code || new Date() > user.verificationCodeExpiry) {
//       throw new BadRequestException('Invalid or expired code');
//     }

//     // تفعيل المستخدم
//     user.isVerified = true;
//     user.verificationCode = null; // حذف الكود بعد الاستخدام
//     user.verificationCodeExpiry = null;

//     await this.userRepository.save(user);

//     return { message: 'Email verified successfully. You can now login.' };
//   }

//   // ----------------------------------------------------------------
//   // 4. Forgot Password
//   // ----------------------------------------------------------------
//   async forgotPassword(email: string) {
//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     if (!user.isVerified) {
//       throw new UnauthorizedException('Please verify your email first.');
//     }
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpiry = new Date(Date.now() + 3600 * 1000);
//     await this.userRepository.save(user);

//     const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

//     await this.mailerService.sendMail({
//       to: user.email,
//       subject: 'Reset Password',
//       template: './reset-password',
//       context: { resetLink },
//       html: `
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetLink}">Reset Password</a>
//       `,
//     });

//     return { message: 'Password reset email sent successfully' };
//   }

//   // ----------------------------------------------------------------
//   // 5. Reset Password
//   // ----------------------------------------------------------------
//   async resetPassword(token: string, newPassword: string) {
//     const user = await this.userRepository.findOne({
//       where: {
//         resetPasswordToken: token,
//         resetPasswordExpiry: MoreThan(new Date()),
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('Invalid token');
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.passwordHash = hashedPassword; // ✅ التعديل: تحديث passwordHash
//     user.resetPasswordToken = null;
//     user.resetPasswordExpiry = null;

//     await this.userRepository.save(user);
//     return { message: 'Password reset successfully' };
//   }

//   // ----------------------------------------------------------------
//   // 6. Validate User (JWT Strategy)
//   // ----------------------------------------------------------------
//   async validateUser(userId: number) {
//     return await this.userRepository.findOne({
//       where: { userId },
//     });
//   }

// }



//=======================================================================================


// import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MoreThan, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../users/entities/user.entity';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { MailerService } from '@nestjs-modules/mailer';
// import * as crypto from 'crypto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//     private mailerService: MailerService,
//   ) { }

//   // ----------------------------------------------------------------
//   // 1. Validate User (التحقق من المستخدم وكلمة المرور)
//   // ----------------------------------------------------------------
//   async validateUserByPassword(email: string, pass: string): Promise<any> {
//     console.log('1. Checking user:', email);

//     // نستخدم QueryBuilder لضمان جلب كلمة المرور حتى لو كانت مخفية
//     const user = await this.userRepository
//       .createQueryBuilder('user')
//       .addSelect('user.passwordHash') // تأكد أن هذا يطابق الاسم في User Entity
//       .where('user.email = :email', { email })
//       .getOne();

//     if (!user) return null;

//     // التعامل مع احتمالية اختلاف التسمية (للاحتياط)
//     const storedHash = user.passwordHash || (user as any).password_hash;

//     if (!storedHash) {
//       console.error("CRITICAL: Password hash missing for user:", email);
//       return null;
//     }

//     // مقارنة كلمة المرور
//     const isMatch = await bcrypt.compare(pass, storedHash);

//     if (isMatch) {
//       // ✅ نجحنا! الآن نحذف الهاش ونعيد بيانات المستخدم فقط
//       const { passwordHash, ...result } = user;
//       return result;
//     }

//     return null;
//   }

//   // ----------------------------------------------------------------
//   // 2. Login (تسجيل الدخول)
//   // ----------------------------------------------------------------
//   async login(loginDto: LoginDto) {
//     try {
//       // ✅ الخطوة 1: التحقق يتم هنا بالكامل
//       const user = await this.validateUserByPassword(loginDto.email, loginDto.password);

//       // إذا رجعت null يعني الإيميل أو الباسورد غلط
//       if (!user) {
//         throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
//       }

//       // ✅ الخطوة 2: فحص التفعيل
//       // نتحقق من الصيغتين (camelCase و snake_case) للاحتياط
//       const isVerified = user.isVerified !== undefined ? user.isVerified : (user as any).is_verified;

//       if (isVerified === false) {
//         throw new UnauthorizedException('PENDING_VERIFICATION');
//       }

//       // ✅ الخطوة 3: إصدار التوكن
//       const payload = { sub: user.userId, email: user.email, role: user.role };
//       const token = this.jwtService.sign(payload);

//       return {
//         user: user,
//         token: token,
//       };

//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       // إعادة رمي الخطأ كما هو إذا كان معروفاً
//       if (error instanceof UnauthorizedException) throw error;
//       throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تسجيل الدخول');
//     }
//   }

//   // ----------------------------------------------------------------
//   // 3. Register (التسجيل)
//   // ----------------------------------------------------------------
//   async register(registerDto: RegisterDto) {
//     // التحقق من وجود المستخدم
//     const existingUser = await this.userRepository.findOne({
//       where: [
//         { email: registerDto.email },
//         { phoneNumber: registerDto.phone },
//       ],
//     });

//     if (existingUser) {
//       throw new ConflictException('البريد الإلكتروني أو الهاتف مستخدم بالفعل');
//     }

//     // تشفير كلمة المرور
//     const hashedPassword = await bcrypt.hash(registerDto.password, 10);
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // إنشاء المستخدم
//     const newUser = this.userRepository.create({
//       username: registerDto.username,
//       email: registerDto.email,
//       fullName: registerDto.fullName,
//       phoneNumber: registerDto.phone,
//       passwordHash: hashedPassword,
//       role: 'user',
//       verificationCode: verificationCode,
//       verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 دقيقة
//       isVerified: false,
//       userType: registerDto.userType || 'both',
//       provinceId: registerDto.province_id,
//       cityId: registerDto.city_id,
//     });

//     const savedUser = await this.userRepository.save(newUser);

//     // إرسال الإيميل
//     await this.mailerService.sendMail({
//       to: savedUser.email,
//       subject: 'تفعيل حسابك',
//       template: './verify-email',
//       html: `<h3>Your Verification Code is: <b>${verificationCode}</b></h3>`
//     });

//     // حذف البيانات الحساسة من الرد
//     const { passwordHash, ...result } = savedUser;

//     return {
//       user: result,
//       message: 'Registration successful. Please check your email for OTP.'
//     };
//   }

//   // ----------------------------------------------------------------
//   // 4. Verify Email (تفعيل الإيميل)
//   // ----------------------------------------------------------------
//   // async verifyEmail(email: string, code: string) {
//   //   const user = await this.userRepository.findOne({ where: { email } });

//   //   if (!user) throw new BadRequestException('المستخدم غير موجود');
//   //   if (user.isVerified) throw new BadRequestException('الحساب مفعل مسبقاً');

//   //   if (user.verificationCode !== code || new Date() > user.verificationCodeExpiry) {
//   //     throw new BadRequestException('الرمز غير صحيح أو منتهي الصلاحية');
//   //   }

//   //   // تفعيل الحساب
//   //   user.isVerified = true;
//   //   user.verificationCode = null;
//   //   user.verificationCodeExpiry = null;
//   //   await this.userRepository.save(user);

//   //   // ✅ التعديل المهم: توليد توكن للدخول المباشر
//   //   const payload = { sub: user.userId, email: user.email, role: user.role };
//   //   const token = this.jwtService.sign(payload);

//   //   return { 
//   //     message: 'Email verified successfully',
//   //     token: token,
//   //     user: user
//   //   };
//   // }

//   async verifyEmail(email: string, code: string) {
//     const user = await this.userRepository.findOne({ where: { email } });

//     if (!user) throw new BadRequestException('المستخدم غير موجود');
//     if (user.isVerified) throw new BadRequestException('الحساب مفعل مسبقاً');

//     // 👇👇 طباعة القيم في التيرمينال لكشف الخطأ 👇👇
//     console.log("🔍 DB Code:", user.verificationCode, "Type:", typeof user.verificationCode);
//     console.log("🔍 Input Code:", code, "Type:", typeof code);
//     console.log("⏰ Expiry:", user.verificationCodeExpiry);
    
//     // 1. التحقق من صلاحية الوقت (تأكد من اسم العمود في قاعدة بياناتك هل هو Expiry أم Expires؟)
//     // سأفترض أنه كما أرسلته لي verificationCodeExpiry
//     if (user.verificationCodeExpiry && new Date() > new Date(user.verificationCodeExpiry)) {
//        throw new BadRequestException('الرمز منتهي الصلاحية');
//     }

//     // 2. التحقق من تطابق الكود (الحل الجذري: تحويل الاثنين لنص)
//     if (String(user.verificationCode).trim() !== String(code).trim()) {
//        throw new BadRequestException('الرمز غير صحيح');
//     }

//     // تفعيل الحساب
//     user.isVerified = true;
//     user.verificationCode = null;
//     user.verificationCodeExpiry = null;
    
//     await this.userRepository.save(user);

//     // ✅ توليد توكن للدخول المباشر
//     const payload = { sub: user.userId, email: user.email, role: user.role };
//     const token = this.jwtService.sign(payload);

//     return { 
//       message: 'Email verified successfully',
//       token: token,
//       user: {
//           id: user.userId, // تأكد هل هو userId أم id
//           email: user.email,
//           role: user.role
//       }
//     };
//   }

//   // ----------------------------------------------------------------
//   // 5. Forgot Password
//   // ----------------------------------------------------------------
//   async forgotPassword(email: string) {
//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) throw new UnauthorizedException('البريد الإلكتروني غير مسجل');
    
//     // يفضل عدم منع تغيير الباسورد للحساب غير المفعل، لكن حسب طلبك:
//     if (!user.isVerified) throw new UnauthorizedException('Please verify your email first.');

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpiry = new Date(Date.now() + 3600 * 1000); // ساعة واحدة
//     await this.userRepository.save(user);

//     const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

//     await this.mailerService.sendMail({
//       to: user.email,
//       subject: 'إعادة تعيين كلمة المرور',
//       html: `<p>Click here to reset: <a href="${resetLink}">Reset Password</a></p>`,
//     });

//     return { message: 'Password reset email sent successfully' };
//   }

//   // ----------------------------------------------------------------
//   // 6. Reset Password
//   // ----------------------------------------------------------------
//   async resetPassword(token: string, newPassword: string) {
//     const user = await this.userRepository.findOne({
//       where: {
//         resetPasswordToken: token,
//         resetPasswordExpiry: MoreThan(new Date()),
//       },
//     });

//     if (!user) throw new UnauthorizedException('الرابط غير صالح أو انتهت صلاحيته');

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.passwordHash = hashedPassword;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpiry = null;

//     await this.userRepository.save(user);
//     return { message: 'تم تغيير كلمة المرور بنجاح' };
//   }

//   // Helper
//   async validateUser(userId: number) {
//     return await this.userRepository.findOne({ where: { userId } });
//   }

//   // دالة لإعادة إرسال رمز التحقق
//   // async resendVerificationCode(email: string) {
//   //   // 1. البحث عن المستخدم
//   //   // ملاحظة: تأكد أن userModel هو الاسم المستخدم لديك في الـ Constructor
//   //   const user = await this.userRepository.findOne({ where: { email } });

//   //   if (!user) {
//   //     throw new NotFoundException('User not found');
//   //   }

//   //   // 2. التحقق مما إذا كان الحساب مفعل مسبقاً
//   //   if (user.isVerified) {
//   //     throw new BadRequestException('Account is already verified');
//   //   }

//   //   // 3. توليد كود جديد (نفس الطريقة المستخدمة في التسجيل)
//   //   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
//   //   // 4. تحديد وقت انتهاء الصلاحية (مثلاً 15 دقيقة من الآن)
//   //   const expiryDate = new Date();
//   //   expiryDate.setMinutes(expiryDate.getMinutes() + 15);

//   //   // 5. تحديث بيانات المستخدم في قاعدة البيانات
//   //   // ملاحظة: تأكد من أسماء الحقول لديك (verificationCode أو otp أو token)
//   //   user.verificationCode = verificationCode; 
//   //   user.verificationCodeExpires = expiryDate;
//   //   await user.save();

//   //   // 6. إرسال الإيميل (استخدم نفس خدمة الإيميل الموجودة عندك)
//   //   // this.mailService.sendUserConfirmation(user, verificationCode); 
//   //   // أو
//   //   // await this.emailService.sendMail(email, 'Verification Code', `Your code is ${verificationCode}`);
    
//   //   // (هنا سأفترض أن لديك دالة جاهزة للإرسال، استدعها هنا)
//   //   console.log(`Resent Code to ${email}: ${verificationCode}`); // للتجربة فقط

//   //   return {
//   //     message: 'Verification code resent successfully',
//   //   };
//   // }
//   // دالة لإعادة إرسال رمز التحقق
//   async resendVerificationCode(email: string) {
//     // 1. البحث عن المستخدم
//     const user = await this.userRepository.findOne({ where: { email } });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // 2. التحقق مما إذا كان الحساب مفعل مسبقاً
//     if (user.isVerified) {
//       throw new BadRequestException('Account is already verified');
//     }

//     // 3. توليد كود جديد
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // 4. تحديد وقت انتهاء الصلاحية
//     const expiryDate = new Date();
//     expiryDate.setMinutes(expiryDate.getMinutes() + 15);

//     // 5. تحديث بيانات المستخدم في قاعدة البيانات
//     user.verificationCode = verificationCode; 
//     user.verificationCodeExpiry = expiryDate;

//     // 🔥 التعديل هنا: نستخدم المستودع للحفظ بدلاً من user.save()
//     await this.userRepository.save(user);

//     // 6. إرسال الإيميل
//     try {
//         // تأكد من تفعيل هذا السطر وإزالة التعليق عنه عندما تكون جاهزاً
//          // إرسال الإيميل باستخدام الدالة الرسمية
//         await this.mailerService.sendMail({
//           to: user.email,                // البريد الإلكتروني للمستخدم
//           subject: 'Your Verification Code', // عنوان الرسالة
//           text: `Your code is ${verificationCode}`, // نص الرسالة (احتياطي)
//           html: `
//             <h3>Hello!</h3>
//             <p>Your verification code is: <b style="font-size: 20px;">${verificationCode}</b></p>
//             <p>This code will expire in 15 minutes.</p>
//           `, // نص الرسالة بتنسيق HTML
//         });
//         console.log(`✅ Resent Code to ${email}: ${verificationCode}`);
//     } catch (e) {
//         console.error("⚠️ Failed to send email", e);
//     }

//     return {
//       message: 'Verification code resent successfully',
//     };
//   }

// }


//================================================-===================================-========================------------=


import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) { }

  // ----------------------------------------------------------------
  // 1. Validate User
  // ----------------------------------------------------------------
  async validateUserByPassword(email: string, pass: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) return null;

    const storedHash = user.passwordHash;
    if (!storedHash) return null;

    const isMatch = await bcrypt.compare(pass, storedHash);

    if (isMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  // ----------------------------------------------------------------
  // 2. Login
  // ----------------------------------------------------------------
  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUserByPassword(loginDto.email, loginDto.password);

      if (!user) {
        throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // التحقق من التفعيل
      if (!user.isVerified) {
        throw new UnauthorizedException('PENDING_VERIFICATION'); // فرونت اند يجب أن يعالج هذا الخطأ
      }

      const payload = { sub: user.userId, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);

      return {
        user: user,
        token: token,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('حدث خطأ غير متوقع أثناء تسجيل الدخول');
    }
  }

  // ----------------------------------------------------------------
  // 3. Register
  // ----------------------------------------------------------------
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { phoneNumber: registerDto.phone },
      ],
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني أو الهاتف مستخدم بالفعل');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phone,
      passwordHash: hashedPassword,
      role: 'user',
      verificationCode: verificationCode,
      verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 دقيقة
      isVerified: false, // ✅ ضبط صريح للقيمة
      userType: registerDto.userType || 'both',
      provinceId: registerDto.province_id,
      cityId: registerDto.city_id,
    });

    const savedUser = await this.userRepository.save(newUser);

    // إرسال الإيميل
    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'تفعيل حسابك',
        html: `
          <h3>Welcome!</h3>
          <p>Your Verification Code is: <b style="font-size: 20px;">${verificationCode}</b></p>
        `
      });
    } catch (e) {
      console.error("Email sending failed:", e);
    }

    const { passwordHash, ...result } = savedUser;

    return {
      user: result,
      message: 'Registration successful. Please check your email for OTP.'
    };
  }

  // ----------------------------------------------------------------
  // 4. Verify Email
  // ----------------------------------------------------------------
  async verifyEmail(email: string, code: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('المستخدم غير موجود');
    
    if (user.isVerified) {
        // يمكننا إرجاع رسالة نجاح عادية بدلاً من خطأ إذا كان المستخدم يحاول تفعيل حساب مفعل أصلاً
        return { message: 'الحساب مفعل بالفعل، يمكنك تسجيل الدخول الآن.' };
    }

    // التحقق من الوقت
    if (user.verificationCodeExpiry && new Date() > new Date(user.verificationCodeExpiry)) {
      throw new BadRequestException('الرمز منتهي الصلاحية');
    }

    // التحقق من تطابق الكود (كنص)
    if (String(user.verificationCode).trim() !== String(code).trim()) {
      throw new BadRequestException('الرمز غير صحيح');
    }

    // تفعيل الحساب
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;

    await this.userRepository.save(user);

    const payload = { sub: user.userId, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Email verified successfully',
      token: token,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role
      }
    };
  }

  // ----------------------------------------------------------------
  // 5. Resend Verification Code
  // ----------------------------------------------------------------
  async resendVerificationCode(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('Account is already verified');

    // توليد كود وتاريخ جديد
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    // تحديث البيانات
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = expiryDate; // ✅ تم استخدام نفس الاسم الموحد

    await this.userRepository.save(user);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'New Verification Code',
        html: `
            <h3>Hello!</h3>
            <p>Your new verification code is: <b style="font-size: 20px;">${verificationCode}</b></p>
            <p>This code will expire in 15 minutes.</p>
          `,
      });
      console.log(`✅ Resent Code to ${email}`);
    } catch (e) {
      console.error("⚠️ Failed to send email", e);
    }

    return {
      message: 'Verification code resent successfully',
    };
  }

  // ----------------------------------------------------------------
  // 6. Forgot & Reset Password
  // ----------------------------------------------------------------
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('البريد الإلكتروني غير مسجل');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 3600 * 1000); 
    await this.userRepository.save(user);

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `<p>Click here to reset: <a href="${resetLink}">Reset Password</a></p>`,
    });

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: MoreThan(new Date()),
      },
    });

    if (!user) throw new UnauthorizedException('الرابط غير صالح أو انتهت صلاحيته');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await this.userRepository.save(user);
    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }
}
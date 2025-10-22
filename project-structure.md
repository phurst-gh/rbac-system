# Project Structure Plan

## 📁 Proposed Directory Structure

```
src/
  controllers/
    auth/
      authController.ts      ← register, login, logout, refresh
      validateEmail.ts       ← Email validation middleware
      validatePassword.ts    ← Password validation middleware  
      hashPassword.ts        ← Password hashing middleware
    
    user/
      userController.ts      ← getProfile, updateProfile, deleteUser
      validateProfile.ts     ← Profile validation middleware
      validateUserUpdate.ts  ← User update validation
    
    admin/                   ← Future: Admin operations
      adminController.ts
      validateAdmin.ts
  
  middleware/
    auth/
      requireAuth.ts         ← Authentication middleware
      requireRole.ts         ← Role-based access (future)
    
    common/
      validation.ts          ← Shared validation utilities
  
  services/                  ← Business logic
    authService.ts
    userService.ts
```

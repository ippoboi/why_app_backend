// throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by email
    const email = req.body?.email;
    if (!email) {
      // Fallback to IP if no email (though this shouldn't happen in your case)
      return req.ip;
    }

    return `email-${email}`; // Add prefix to avoid any potential conflicts
  }
}

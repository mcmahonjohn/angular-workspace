import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { WsGateway } from './ws/ws.gateway';

@Module({
  imports: [ApiModule],
  controllers: [],
  providers: [AppService, WsGateway],
})
export class AppModule {}

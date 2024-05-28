import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async checkUsedEmail(email: string) {
    const test = await this.staffRepository.findOne({
      where: {
        email: email,
      },
    });
    console.log(test);
    return test;
  }

  async create(createStaffDto: CreateStaffDto) {
    const checkStaff = await this.checkUsedEmail(createStaffDto.email);

    if (checkStaff) throw new ConflictException('duplicated email');

    const staff = await this.staffRepository.save(
      this.staffRepository.create({
        ...createStaffDto,
      }),
    );

    const { password, ...rest } = staff;

    return rest;
  }

  findAll() {
    return this.staffRepository.find();
  }

  findOne(staffId: string) {
    return this.staffRepository.findOneByOrFail({ id: staffId }).catch(() => {
      throw new NotFoundException('staff not found');
    });
  }

  async update(staffId: string, UpdateStaffDto: UpdateStaffDto) {
    if (UpdateStaffDto.email) {
      const checkStaff = await this.checkUsedEmail(UpdateStaffDto.email);
      if (checkStaff && checkStaff.id !== staffId) {
        throw new ConflictException('email already use');
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}

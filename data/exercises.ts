import { Eye, Infinity as InfinityIcon, Focus, Sun, Clock, RotateCw, MoveHorizontal, Shuffle } from 'lucide-react';
import { Exercise, ExerciseType } from '../types';

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    type: ExerciseType.RULE_20_20_20,
    title: '20-20-20 규칙',
    description: '디지털 기기 사용 시 눈의 피로를 줄이는 가장 기본적인 휴식법입니다.',
    durationSeconds: 20,
    icon: Clock,
    color: 'bg-blue-100 text-blue-600',
    difficulty: 'Easy',
    instructions: [
      '20분마다 화면에서 눈을 떼세요.',
      '20피트(약 6미터) 먼 곳을 바라보세요.',
      '20초 동안 그 상태를 유지하며 눈의 근육을 이완시킵니다.'
    ]
  },
  {
    id: '2',
    type: ExerciseType.FIGURE_EIGHT,
    title: '8자 그리기',
    description: '눈동자를 움직여 유연성을 기르고 눈 주변 근육을 강화합니다.',
    durationSeconds: 45,
    icon: InfinityIcon,
    color: 'bg-purple-100 text-purple-600',
    difficulty: 'Medium',
    instructions: [
      '머리는 고정한 채 눈동자만 움직입니다.',
      '화면에 나타나는 공을 따라 눈을 8자 모양으로 움직이세요.',
      '천천히 부드럽게 움직이는 것이 중요합니다.'
    ]
  },
  {
    id: '3',
    type: ExerciseType.CIRCLE,
    title: '원 그리기',
    description: '눈을 크게 뜨고 원을 그리며 안구 근육을 골고루 스트레칭합니다.',
    durationSeconds: 30,
    icon: RotateCw,
    color: 'bg-indigo-100 text-indigo-600',
    difficulty: 'Medium',
    instructions: [
      '시계 방향으로 천천히 눈을 돌립니다.',
      '가능한 한 가장 큰 원을 그리듯 눈을 움직이세요.',
      '반대 방향으로도 진행합니다.'
    ]
  },
  {
    id: '4',
    type: ExerciseType.LEFT_RIGHT,
    title: '좌우 운동',
    description: '눈을 좌우로 최대한 움직여 수평 외안근을 단련합니다.',
    durationSeconds: 30,
    icon: MoveHorizontal,
    color: 'bg-rose-100 text-rose-600',
    difficulty: 'Easy',
    instructions: [
      '고개는 정면을 유지하고 눈만 오른쪽 끝을 봅니다.',
      '3초간 유지 후 왼쪽 끝을 봅니다.',
      '눈이 당겨지는 느낌이 들 정도로 최대한 움직이세요.'
    ]
  },
  {
    id: '5',
    type: ExerciseType.RANDOM,
    title: '무작위 추적',
    description: '불규칙하게 움직이는 대상을 쫓으며 반응 속도와 집중력을 높입니다.',
    durationSeconds: 45,
    icon: Shuffle,
    color: 'bg-teal-100 text-teal-600',
    difficulty: 'Hard',
    instructions: [
      '화면 안에서 무작위로 나타나는 공을 찾으세요.',
      '공이 이동할 때마다 시선을 빠르게 이동합니다.',
      '고개는 움직이지 않고 눈동자만 움직입니다.'
    ]
  },
  {
    id: '6',
    type: ExerciseType.FOCUS_CHANGE,
    title: '원근 조절 운동',
    description: '가까운 곳과 먼 곳을 번갈아 보며 수정체의 조절력을 키웁니다.',
    durationSeconds: 60,
    icon: Focus,
    color: 'bg-emerald-100 text-emerald-600',
    difficulty: 'Medium',
    instructions: [
      '엄지손가락을 눈 앞 10cm 거리에 둡니다.',
      '엄지손가락에 초점을 맞추세요.',
      '팔을 쭉 뻗으며 시선은 계속 손가락을 따라갑니다.',
      '다시 천천히 눈 앞으로 가져오세요.'
    ]
  },
  {
    id: '7',
    type: ExerciseType.PALMING,
    title: '온열 찜질 (Palming)',
    description: '손바닥의 열기로 눈의 긴장을 풀고 편안하게 만듭니다.',
    durationSeconds: 60,
    icon: Sun,
    color: 'bg-orange-100 text-orange-600',
    difficulty: 'Easy',
    instructions: [
      '양 손바닥을 비벼 따뜻하게 만듭니다.',
      '따뜻해진 손바닥을 오목하게 만들어 눈을 덮습니다.',
      '눈을 감고 어둠 속에서 편안함을 느껴보세요.',
      '빛이 들어오지 않도록 하되 눈을 압박하지는 마세요.'
    ]
  },
  {
    id: '8',
    type: ExerciseType.BLINKING,
    title: '의식적 깜빡임',
    description: '안구 건조를 예방하기 위해 눈을 완전히 감았다 뜨는 연습입니다.',
    durationSeconds: 30,
    icon: Eye,
    color: 'bg-cyan-100 text-cyan-600',
    difficulty: 'Easy',
    instructions: [
      '눈을 천천히 감으세요.',
      '잠시 멈춘 후 눈을 크게 뜨세요.',
      '이를 반복하며 눈물막이 고르게 퍼지도록 합니다.'
    ]
  }
];
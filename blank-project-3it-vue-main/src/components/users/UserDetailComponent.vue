<script setup lang="ts">
  import type { User } from '@/interfaces'
  //Props
  const props = defineProps({
	record: {
	  type: Object as () => User,
	  required: true,
	  default: () => ({})
	}
  })
</script>

<template>
  <div 
    class="eit-border--round-left-md-x60"
    data-eit-border="all"
    data-eit-border-color="default"
    data-eit-border-radius="x3"
    data-eit-p="3"
    data-eit-my="3"
  >
    <div 
      data-eit-display="flex"
      data-eit-flex-wrap='wrap'
      data-eit-gap="3"
    >
      <div 
        data-eit-flex-grow='1'
        data-eit-flex-grow-md='0'
        data-eit-flex-shrink-md='0'
        data-eit-display="none"
        data-eit-display-md="flex"
      >
        <AvatarComponent
          width="90"
          class="eit-avatar"
          data-eit-object-fit='contain'
          data-eit-shape='circle'
        />
      </div>
      <div data-eit-flex-grow='1'>
        <h5
          data-eit-font-size="x4"
          data-eit-color="primary"
          data-eit-mt="0"
          data-eit-mb="1"
          data-eit-font-weight="900"
        >
          {{ props.record.name }}
        </h5>
        <ul 
          data-eit-my="0"
          data-eit-font-size="x2"
          data-eit-list="unstyled"
        >
          <li data-eit-color="text-soft">
            <font-awesome-icon 
              :icon="['fas', 'envelope']" 
              data-eit-color="tertiary"
              data-eit-me="2"
            />
            {{ props.record.workEmail }}
          </li>
          <li data-eit-color="text-soft">
            <font-awesome-icon 
              :icon="['fas', 'address-card']" 
              data-eit-color="tertiary"
              data-eit-me="2"
            />
            {{ props.record.identification }}
          </li>
          <li data-eit-color="text-soft">
            <font-awesome-icon 
              :icon="['fas', 'square-phone']" 
              data-eit-color="tertiary"
              data-eit-me="2"
            />
            {{ props.record.phoneNumber }}
          </li>
        </ul>
      </div>
      <div data-eit-flex-shrink='1'>
        <BadgeComponent
          :text="props.record.role?.name"
          :class="`${props.record.role?.className} eit-font__size--x2`"
        />
      </div>
    </div>
  </div>

  <div 
    data-eit-display="flex"
    data-eit-gap="2"
    data-eit-flex-direction='row'
    data-eit-flex-wrap="wrap"
  >
    <div 
      data-eit-border="all"
      data-eit-border-color="default"
      data-eit-border-radius="x3"
      data-eit-flex='fill'
      data-eit-mb='3'
      data-eit-p='2'
    >
      <div data-eit-display="flex">
        <div data-eit-flex-shrink='0'>
          <font-awesome-icon 
            :icon="['fas', 'arrow-right-to-bracket']" 
            data-eit-font-size="x6"
            data-eit-color="text-soft"
          />
        </div>
        <div 
          data-eit-flex-grow="1"
          data-eit-ms="3"
        >
          <h6 
            data-eit-color="text-soft"
            data-eit-font-size="x3"
            data-eit-mt="0"
            data-eit-mb="1"
            >
              Primera conexión
            </h6>
          <p 
            data-eit-color="text"
            data-eit-my="0"
          >
            {{ props.record.createdAt }}
          </p>
        </div>
      </div>
    </div>
    <div 
      data-eit-border="all"
      data-eit-border-color="default"
      data-eit-border-radius="x3"
      data-eit-flex='fill'
      data-eit-mb='3'
      data-eit-p='2'
    >
      <div data-eit-display="flex">
        <div data-eit-flex-shrink='0'>
          <font-awesome-icon 
            :icon="['fas', 'arrow-right-to-bracket']" 
            data-eit-font-size="x6"
            data-eit-color="tertiary"
          />
        </div>
        <div 
          data-eit-flex-grow="1" 
          data-eit-ms="3"
        >
          <h6 
            data-eit-color="text-soft"
            data-eit-font-size="x3"
            data-eit-mt="0"
            data-eit-mb="1"
          >
            Última conexión
          </h6>
          <p 
            data-eit-color="text"
            data-eit-my="0"
          >
            {{ props.record.lastLogin }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <h3 
    data-eit-font-size="x5"
    data-eit-color="secondary"
    data-eit-font-weight="900"
    data-eit-my="0"
  >
    Información adicional
  </h3>

 <ul 
  data-eit-list="unstyled"
  data-eit-mb="3"
  data-eit-font-size="x2"
>
    <li 
      data-eit-display="flex"
      data-eit-justify="between"
      data-eit-color="text-soft"
      data-eit-border="bottom"
      data-eit-border-color="default"
      data-eit-pb="1"
      data-eit-mb="2"
    >
      Modo SSO
      <span 
        data-eit-color="text"
        data-eit-ms="3"
      >
        {{ props.record.loginViaSso ? 'Habilitado' : 'Deshabilitado' }}
      </span>
    </li>
 </ul>

</template>
<?php

namespace App\Document;

use App\Enum\RootRequirementType;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'requirements')]
class Requirement
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $content;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $rootRequirementType;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $nonRootRequirementType;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Requirement
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->content;
    }

    public function setName(string $content): Requirement
    {
        $this->content = $content;
        return $this;
    }

    public function getRootRequirementType(): RootRequirementType
    {
        return RootRequirementType::from($this->rootRequirementType);
    }

    public function setRootRequirementType(RootRequirementType $type): Requirement
    {
        $this->rootRequirementType = $type->value;
        return $this;
    }

    public function getNonRootRequirementType(): RootRequirementType
    {
        return RootRequirementType::from($this->nonRootRequirementType);
    }

    public function setNonRootRequirementType(RootRequirementType $type): Requirement
    {
        $this->nonRootRequirementType = $type->value;
        return $this;
    }

}

<?php

namespace App\Document;

use App\Document\AbstractClasses\Requirement;
use App\Enum\RootRequirementType;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'requirements')]
class RootRequirement extends Requirement
{

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $requirementType;

    public function getRequirementType(): RootRequirementType
    {
        return RootRequirementType::from($this->requirementType);
    }

    public function setRequirementType(RootRequirementType $type): self
    {
        $this->requirementType = $type->value;
        return $this;
    }

}
